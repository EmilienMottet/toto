#! /bin/sh
DATA=$(cd $(dirname $0)/.. && pwd)
. $DATA/bin/ngstart.env
$DATA/bin/cvcommand $NGGATEWAYPROTOCOL://$NGGATEWAYHOSTPORT cvinspect $@
