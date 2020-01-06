#!/bin/bash

set -v

if [ -z "$1" ]; then
    echo "No args found, please add the name of the function you want to invoke. E.g. './invoke.sh initCount"
    exit 1
fi

echo "Invoking $1 $2"
docker exec cli peer chaincode invoke \
       -o orderer.ipa.com:7050 \
       -C ipachannel \
       -n journalContract \
       -c "{\"Args\":[\"$1\", \"$2\"]}"
