# Setup

## Start Network
``` shell
cd network
# start.sh has to be sourced because of `unset`
. ./start.sh 
```

## Deploy and invoke Chaincode
``` shell
cd contract
# deploy has to be sourced to save version as environment variable!
. ./deploy
./invoke.sh initCount
```
Fabric reuses chaincode images, which have the same name and version. We have to remove those if we deploy a chaincode with the same name and version, which has been previously deployed by using `docker system prune -a` or deleting the docker images manually `docker rmi {IMAGE}`.






