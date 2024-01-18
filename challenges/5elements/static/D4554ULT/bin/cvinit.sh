#!/bin/sh

MIN_RECOMMENDED_FILES=4096

# Note: seems insane, but "X" on Linux means a maximum of ${X-800} threads
# (ie. 1024 ==> 200 threads approximately)
MIN_RECOMMENDED_PROCESS=2048

DATA=`cd \`dirname $0\`/.. && pwd -P`

if test -f "${DATA}/bin/ngstart.env" ; then
. "${DATA}/bin/ngstart.env"
fi
MERCURYBIN="${NGINSTALLDIR}/${NGARCH}/bin/mercury.bin"



unset http_proxy

Usage() {
  echo "Usage : cvinit.sh COMMAND" >&2
  echo "  - start:         Start CloudView" >&2
  echo "  - stop:          Stop CloudView" >&2
  echo "  - restart:       Restart CloudView" >&2
  echo "  - kill :         Forcibly stop CloudView" >&2
  echo "  - status:        Get the status of the CloudView processes" >&2
  echo "  - wait-started:  Waits until all CloudView processes are started" >&2
  echo "                   Return code is 1 if not all processes could be started" >&2
  echo ""  >&2
  echo "  - detach:       Detach this CloudView host from its master, so that it stops receiving configuration updates" >&2
  echo "  - attach:       Attach this CloudView host to its master, so that it receives configuration updates" >&2
  echo "" >&2
  echo "  - check-indexes-up [global]:" >&2
  echo "                      Checks that all indexes on this host are up and ready to answer queries." >&2
  echo "                      Return code is 0 if all indexes are up, 1 else" >&2
  echo "                      If 'global' argument is given, checks all indexes on all hosts" >&2
  echo "" >&2
  echo "  - set-not-alive:    Forces all 'isAlive' health monitors on this host as down (to be used with a loadbalancer)" >&2
  echo "  - set-alive:        Don't force all 'isAlive' health monitors on this host as down (to be used with a loadbalancer)"  >&2
  echo "  - is-alive:         Returns whether the 'isAlive' health monitors have been forced as down" >&2
  exit 1
}

Error() {
    echo "** Error: $1" >&2
    exit 1
}

SoftWarning() {
  echo "** WARNING: $1" >&2
}

Warning() {
    echo "***********************************************************************************"
    echo "********************************* WARNING *****************************************"
    echo "* $1" >&2
    echo "***********************************************************************************"
    echo "***********************************************************************************"
}

XvfbCheck() {
    if which Xvfb >/dev/null 2>/dev/null ; then
        Xvfb :42 -ac -screen 0 800x600x24 >/dev/null 2>/dev/null &
        pid="$!"
        trap "kill $pid" 1 2 3 15
        sleep 0.1
        if test -d "/proc/${pid}" ; then
            wait=10
            while ! bash -c 'echo "" > /dev/tcp/127.0.0.1/6042' 2>/dev/null ; do
                sleep 0.5
                wait=`expr $wait - 1`
                if [ $wait -eq 0 ] ; then
                    break;
                fi
            done
            result=$?
            if [ $result -eq 0 ] ; then
                ret=0
            else
                ret=2
            fi
        else
            ret=1
        fi
        kill "$pid" 2>/dev/null
        trap - 1 2 3 15
        return $ret
    else
        return 99
    fi
}

HostAgentPortOpenedCheckable() {
    PATH=/usr/sbin:/usr/bin:/bin which ss >/dev/null 2>/dev/null
}

HostAgentPortOpened() {
    PATH=/usr/sbin:/usr/bin:/bin ss -ltn "( sport = :${NGHOSTAGENTPORT} )" | grep ${NGHOSTAGENTPORT} >/dev/null
}

Start() {
  force=$1
  allOK=2

  # Check port is not opened
  HostAgentPortOpenedCheckable && HostAgentPortOpened && Error "An instance is already running on ${NGHOSTNAME}:${NGBASEPORT}"
  
  if [ "`uname`" = "SunOS" ]; then
      id=/usr/xpg4/bin/id
  else
      id=id
  fi
  
  # Check UID
  uid=`LANG=C ${id} -u`
  if [ "$uid" -eq 0 ] ; then
    Warning "YOU ARE RUNNING AS ROOT. Installing with root privileges is a potential security vulnerability source, and will cause several components not to work properly. ROOT INSTALL IS NOT OFFICIALLY SUPPORTED."
  fi
  uidfile="${DATA}/uid.txt"
  uidn=`LANG=C ${id} -nu`
  fullid="${uidn} (${uid})"
  if test -f "$uidfile"; then
      if prev="`cat "$uidfile"`"; then
          if [ "$prev" != "$fullid" ]; then
              Error "This product was previously run with user '$prev', and you are logged as user '$fullid', which may lead to erroneous behavior. To override this at your own risks, you can erase the $uidfile file."
              exit 1
          fi
      else
          Error "Could not read $uidfile"
      fi
  else
      echo "$fullid" > "$uidfile" || Error "Could not write to $uidfile"
  fi
  
  # LANG=C : See BUG #9173
  current_soft_fd=`LANG=C ulimit -n`
  current_hard_fd=`LANG=C ulimit -H -n`
  if [ "${current_soft_fd}" != 'unlimited' -a "${current_hard_fd}" != 'unlimited' ] ; then
      if [ $current_soft_fd -lt ${MIN_RECOMMENDED_FILES} ]; then
          new_max_fd=
          if [ $MIN_RECOMMENDED_FILES -le $current_hard_fd ]; then
              new_max_fd=$MIN_RECOMMENDED_FILES
              SoftWarning "Forcing soft limit for 'max opened files' to ${new_max_fd}"
          else
              new_max_fd=$current_hard_fd
	      allOK=0
              Warning "Max opened files is limited to ${new_max_fd}. Can't set it to ${MIN_RECOMMENDED_FILES} because of hard limit. Please check your 'ulimit -n'. More information is available in the Installation Guide."
          fi
          LANG=C ulimit -n ${new_max_fd}
      fi
  fi

  # check for VM space ; see BUG #8539
  max_vm_space=`LANG=C bash -c "ulimit -v"`
  if [ "${max_vm_space}" != 'unlimited' ]; then
      allOK=0
      Warning "Max amount of virtual memory is limited to ${max_vm_space} and should be unlimited. Please check your 'ulimit -v'. More information is available in the Installation Guide."
  fi


  # ulimit -u does not work correctly on AIX: limit and ability to set it depends on the shell
  # So, don't check anything
  isAIX=0
  uname | grep AIX > /dev/null
  if [ $? = 0 ]; then
    isAIX=1
  fi
  if [ $isAIX = 0 ]
  then
    # check for number of process ; see tech-rescue
    # <AE2BEA127BD00C44B1799E42052766E7216981E6@EU-DCC-MBX03.dsone.3ds.com>
    max_proc=`LANG=C bash -c "ulimit -u" 2>/dev/null`
    if [ "${max_proc}" != '' ]; then
      if [ "${max_proc}" != 'unlimited' ]; then
        if [ $max_proc -lt $MIN_RECOMMENDED_PROCESS ]; then
          allOK=0
          Warning "Max number of threads is limited to ${max_proc} and should at least be ${MIN_RECOMMENDED_PROCESS}. Please check your 'ulimit -u'. More information is available in the Installation Guide."
        fi
      fi
    fi
  fi

  # Check XVfb
  uname | grep Linux > /dev/null
  if [ $? = 0 ]; then
      XvfbCheck
      case $? in
          0)
              ;;
          1|2)
              Warning "Xvfb appears not to work properly. Some thumbnails features will be missing. (try to start 'Xvfb :42' manually to debug the issue)"
              ;;
          99)
              Warning "Xvfb appears not to be available. Some thumbnails features will be missing. (the 'Xvfb' executable seems to be missing in the current PATH)"
              ;;
          *)
              Warning "Xvfb may not work properly."
              ;;
      esac
  fi

  # Check filesystem type (see BUG #8035)
  # For types, see mount(8) (http://linux.die.net/man/8/mount)
  if test -x "/usr/bin/stat"; then
      if datadir_filesystem_type="`/usr/bin/stat -f --format='%T' ${DATA}`" ;
      then
          case "${datadir_filesystem_type}" in
              ext[234]*|xfs|tmpfs|nfs|nfs4)
          # Looks good. Note: tmpfs is for dev mostly.
                  ;;
              cifs|smbfs|reiserfs)
          # Looks totally insane.
                  Error "Unsupported filesystem type '${datadir_filesystem_type}'. Supported filesystems are EXT3, EXT4, XFS and NFS."
                  ;;
              *)
		  # Looks unknown.
		  if [ $force = 0 ]; then
		     Warning "Unrecognized or unsupported filesystem type '${datadir_filesystem_type}'. Supported filesystems are EXT3, EXT4, XFS and NFS."
		  fi
                  ;;
          esac
      else
      # Looks unknown.
          Warning "Unable to get filesystem type for '${DATA}', assuming the filesystem is okay .."
      fi
  fi

  # Check port range (see BUG #15174)
  if test -n "$NGBASEPORT"; then
      baseport="$NGBASEPORT"
  elif test -n "$NGHOSTAGENTPORT"; then
      baseport="$NGHOSTAGENTPORT"
  else
      Warning "Unable to get the port range"
  fi
  if test -n "$baseport" ; then
      if test -f "/proc/sys/net/ipv4/ip_local_port_range"; then
          rg_start=`cat /proc/sys/net/ipv4/ip_local_port_range | cut -f1`
          rg_end=`cat /proc/sys/net/ipv4/ip_local_port_range | cut -f2`
      fi
      if test ! -n "$rg_start"; then
          # make a guess
          rg_start=32768
      fi
      if test ! -n "$rg_end"; then
          rg_end=65535
      fi
      rg_priv=1024
      # note: is it sufficient ?
      rg_count=200
      endport=`expr $baseport + $rg_count`
      if test "$endport" -lt "$rg_priv" ; then
          Warning "Port base ${baseport} is below the privileged port range. Ensure the product has proper rights to allocate ports in this range."
      fi
      if test "$endport" -gt 65535 ; then
          Warning "Port base ${baseport} is near the port range end (65535). If you are using many services, the current range may not be sufficient, and this may cause additional services not to start correctly, or cause them failure communicating with each other. Please change the base port in a production environment, or you may experience random stability issues."
      fi
      if test "$endport" -ge "$rg_start"; then
          if test "$baseport" -lt "$rg_end"; then
              Warning "Port range [${baseport} .. ${endport}] is within [${rg_start} .. ${rg_end}], which is used by the system to allocate local client ports. Some services may fail unexpectedly, may have issues restarting, or communicating with each other. Please change the base port in a production environment, or you may experience random stability issues."
          fi
      fi
  fi

  if [ $force = 1 ] && [ $allOK = 0 ]
  then
      SoftWarning "Ignoring warnings and starting CloudView nevertheless"
  elif [ $allOK = 0 ]
  then
      SoftWarning "Checks for environment sanity failed. Please fix and retry"
      SoftWarning "If you want to ignore the checks and start nevertheless, please run '$0 start -f'"
      exit 1
  fi

  "${NGINSTALLDIR}/tools/java-install" "com.exalead.cloudview.admintools.RebuildDataDirFromInstallDir" --ifVersionChange "${DATA}" "${NGINSTALLDIR}" || Error "Auto Upgrade failed" 

  # rock'in
  echo "** Starting CloudView ..."
  "${DATA}/bin/exa" -bin "${MERCURYBIN}" com.exalead.mercury.util.waitForLockRelease "${DATA}/run/hostagent/daemon.pid" "1"
  if [ $? -eq 1 ]; then
      Error "Failed to start cloudview"
  fi

  "${DATA}/bin/exa" -bin "${MERCURYBIN}" com.exalead.mercury.util.sanityCheck || Error "CloudView failed to start."

  "${DATA}/bin/cvd" || Error "CloudView failed to start"
  for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do
    sleep 1
    if "${DATA}/bin/cvcommand" :${NGHOSTAGENTPORT} /ken ListAllProcessesText > /dev/null; then
      break
    elif [ $i -eq 30 ]; then
      Error "could not get CloudView status after 30s"
    else
      echo "*** retrying..." >&2
    fi
  done
  echo "** CloudView started on ${NGHOSTNAME}:${baseport}"
}

ReallyStop() {
    "${DATA}/bin/cvcommand" :${NGHOSTAGENTPORT} /ken StopRuntime
    "${DATA}/bin/exa" -bin ${MERCURYBIN} com.exalead.mercury.util.waitForLockRelease "${DATA}/run/hostagent/daemon.pid" "30"
    if [ $? -eq 0 ]; then
        echo "** CloudView has been successfully stopped."
    else
        echo "** CloudView failed to stop gracefully after 30s. Kill remaining processes."
        Kill
    fi
}
    
Stop() {
    echo "** Stopping CloudView ..."
    
    HostAgentPortOpenedCheckable
    if [ $? -eq 1 ]; then
	ReallyStop
    else 
	HostAgentPortOpened
	if [ $? -eq 0 ]; then
	    ReallyStop
	else
	    echo "** CloudView is already stopped."
	fi
    fi
}

Status() {
  "${DATA}/bin/cvcommand" :${NGHOSTAGENTPORT} /ken ListAllProcessesText ||
    Error "could not get CloudView status"
}

Restart() {
    echo "** Restarting CloudView ..."
    Stop
    Start $1
}

GetLivingCVPids() {
    isSolaris=0
    uname | grep  SunOS > /dev/null
    if [ $? = 0 ]; then
      isSolaris=1
    fi

    pids=
    for p in `cat ${DATA}/run/thumbnails-*/daemon.pid 2>/dev/null`; do
      ps -p $p > /dev/null && pids="$pids $p"
    done

    for p in `cat ${DATA}/run/convert-*/daemon.pid 2>/dev/null`; do
      ps -p $p > /dev/null && pids="$pids $p"
    done

    instance=`grep "^NGINSTALLNAME=" ${DATA}/bin/ngstart.env | cut -d = -f 2`

    # collecting bee based processes
    pids2=`ps -U $USER -o pid | grep -v PID`
    for p in $pids2; do
      cmd=
      if [ $isSolaris = 1 ]; then
        cmd=`pargs $p 2>/dev/null | nawk -F': ' '/argv/ {printf "%s ", $2} END {printf "\n"}'`
      else
        cmd=`ps -p $p -o args=`
      fi
      echo $cmd | egrep -e "\/(exa|java) .* --key installName $instance " > /dev/null
      if [ $? = 0 ]; then
        pids="$pids $p"
      fi
    done

    pids=`echo $pids | sort | uniq`
}

Kill() {
    GetLivingCVPids
    
    if test -n "$pids"; then
      echo "Soft killing pids: $pids" >&2
      echo $pids | xargs kill 2>/dev/null
      sleep 5
    else
      echo "No process to be killed" >&2
    fi
    
    GetLivingCVPids

    if test -n "$pids"; then
      echo "Hard killing pids: $pids" >&2
      echo $pids | xargs kill -9 2>/dev/null
      sleep 2
    fi
}

if [ $# -eq 0 ]; then
    Usage
fi



while [ $# -ne 0 ]; do
    case $1 in
        start)
	    if [ $# -eq 2 ] && [ $2 = "-f" ]
	    then
              shift
              Start 1
	    else
	      Start 0
	    fi
	    shift
            ;;
        stop)
            Stop
            shift
            ;;
	wait-started)
	   "${DATA}/bin/java" "com.exalead.cloudview.admintools.WaitProcessesStarted" $NGHOSTAGENTPORT 600
	   exit $?
   	   ;;
        restart)
	    if [ $# -eq 2 ] && [ $2 = "-f" ]
	    then
              shift
              Restart 1
	    else
	      Restart 0
	    fi
            shift
            ;;
        status)
            Status
            shift
            ;;
	kill)
	    Kill
	    shift
	   ;;
	detach)
	   touch ${DATA}/detached_from_master
	   shift
	   ;;
	attach)
	   rm -f ${DATA}/detached_from_master
	   shift
	   ;;
	check-indexes-up)
           shift
           "${DATA}/bin/java" "com.exalead.cloudview.admintools.IndexStatusChecker" $NGGATEWAYHOSTPORT $*
	   exit $?
	   ;;

	set-alive)
           "${DATA}/bin/java" "com.exalead.cloudview.admintools.HostAliveControl" set-alive
	   exit $?
	   ;;
	set-not-alive)
           "${DATA}/bin/java" "com.exalead.cloudview.admintools.HostAliveControl" set-not-alive
	   exit $?
	   ;;
	is-alive)
           "${DATA}/bin/java" "com.exalead.cloudview.admintools.HostAliveControl" is-alive
	   exit $?
	   ;;

        *)
            Usage
            ;;
    esac
done
