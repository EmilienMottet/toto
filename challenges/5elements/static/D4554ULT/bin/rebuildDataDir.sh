#! /bin/sh
DATA=$(cd $(dirname $0)/.. && pwd)
. $DATA/bin/ngstart.env
"$NGINSTALLDIR/tools/java-install" "com.exalead.cloudview.admintools.RebuildDataDirFromInstallDir" --ifVersionChange "$DATA" "$NGINSTALLDIR"
