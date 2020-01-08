"use strict";

const fs = require("fs");
const { FileSystemWallet, Gateway } = require("fabric-network");
const yaml = require("js-yaml");

const wallet = new FileSystemWallet("./wallet");

class journalContract {
  constructor() {}

  async logCtx(username) {
    const gateway = new Gateway();

    try {
      let connectionProfile = yaml.safeLoad(
        fs.readFileSync("../network/connection-ipa.yaml", "utf8")
      );

      let connectionOptions = {
        identity: username,
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
      const addArticleResponse = await contract.evaluateTransaction("logCtx");
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
}

async function addArticle(title: string, userName: string) {
  const gateway = new Gateway();

  try {
    let connectionProfile = yaml.safeLoad(
      fs.readFileSync("../network/connection-ipa.yaml", "utf8")
    );

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
      title
    );
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

module.exports = { addArticle, journalContract };
