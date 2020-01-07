# Exit on first error, print all commands.
set -ev

unset CONTACT_VERSION
docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d
docker ps -a

# wait for Hyperledger Fabric to start
sleep 10

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=IPAOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org.ipa.com/msp" peer0.org.ipa.com peer channel create -o orderer.ipa.com:7050 -c ipachannel -f /etc/hyperledger/configtx/channel.tx

# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=IPAOrgMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org.ipa.com/msp" peer0.org.ipa.com peer channel join -b ipachannel.block

# Enroll admin for fabric-ca-client
docker exec ca.ipa.com fabric-ca-client enroll -u http://admin:adminpw@localhost:7054

# Add fabric-ca org.ipa.journal affiliation
docker exec ca.ipa.com fabric-ca-client affiliation add ipa
docker exec ca.ipa.com fabric-ca-client affiliation add ipa.journal
