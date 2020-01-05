# Setup

## Start Network
``` shell
cd network
./start.sh
```

## Deploy and invoke Chaincode
``` shell
cd contract
# deploy has to be sourced to save version as environment variable!
. ./deploy
./invoke.sh initCount
```





