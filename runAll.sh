echo "Start Fabric blockchain"
cd ./network
./start.sh
cd ../

echo "Deploy contract"
cd ./contract
./deploy.sh
cd ../

. ~/.nvm/nvm.sh 
nvm use 10

echo "Setup and start backend"
cd ./backend
yarn setup
yarn start &
cd ../

echo "Start application"
cd ./application
yarn dev &
cd ../





