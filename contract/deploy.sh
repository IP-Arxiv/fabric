#!/bin/bash

# [-z STRING] True if the length "STRING" is zero
if [ -z "$CONTRACT_VERSION" ]; then
    export CONTRACT_VERSION=0
else
    export CONTRACT_VERSION=$(($CONTRACT_VERSION+1))
fi
echo "Version: $CONTRACT_VERSION"

echo "Install contract"
# Install contract
docker exec cli peer chaincode install \
       -o orderer.ipa.com:7050 \
       -n journalContract \
       -v $CONTRACT_VERSION \
       -p /opt/gopath/src/github.com/contract \
       -l node

if [ $CONTRACT_VERSION == 0 ]; then
    # Instantiate contract
    echo "Instatiate contract"
    docker exec cli peer chaincode instantiate \
	   -o orderer.ipa.com:7050 \
	   -n journalContract \
	   -v $CONTRACT_VERSION \
	   -C ipachannel \
	   -c '{"Args":["instantiate"]}'
else
    # Upgrade contract
    echo "Upgrade contract"
    docker exec cli peer chaincode upgrade \
	   -o orderer.ipa.com:7050 \
	   -n journalContract \
	   -v $CONTRACT_VERSION \
	   -C ipachannel \
	   -c '{"Args":["instantiate"]}'
fi
