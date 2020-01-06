"use strict";

const fs = require("fs");
const { FileSystemWallet, Gateway } = require("fabric-network");
const yaml = require("js-yaml");

const wallet = new FileSystemWallet("./wallet");

async function main() {
  const gateway = new Gateway();

  try {
    const userName = "user1";

    let connectionProfile = yaml.safeLoad(
      fs.readFileSync("../network/connection-ipa.yaml", "utf8")
    );

    console.log(connectionProfile);
    console.log(wallet);

    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled: true, asLocalhost: true }
    };

    console.log("Connect to Fabric gateway.");

    await gateway.connect(connectionProfile, connectionOptions);

    console.log("Use newtwork channel: ipachannel.");

    const network = await gateway.getNetwork("ipachannel");

    console.log("Use journalContract smart contract.");
    const contract = await network.getContract("journalContract");

    console.log("add article");
    const addArticleResponse = await contract.submitTransaction(
      "addArticle",
      "First Title"
    );
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

main().then(() => {
  console.log("added article");
});
