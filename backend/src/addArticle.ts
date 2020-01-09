"use strict";

const fs = require("fs");
const { FileSystemWallet, Gateway } = require("fabric-network");
const yaml = require("js-yaml");

const wallet = new FileSystemWallet("./wallet");

export class Journal {
  username = null;
  contract = null;

  constructor(username) {
    this.username = username;
  }

  async init(callback) {
    await this.initContract();
    callback.bind(this)();
  }

  async initContract() {
    const gateway = new Gateway();

    let connectionProfile = yaml.safeLoad(
      fs.readFileSync("../network/connection-ipa.yaml", "utf8")
    );

    let connectionOptions = {
      identity: this.username,
      wallet: wallet,
      discovery: { enabled: true, asLocalhost: true }
    };

    console.log("Connect to Fabric gateway.");

    await gateway.connect(connectionProfile, connectionOptions);

    console.log("Use newtwork channel: ipachannel.");

    const network = await gateway.getNetwork("ipachannel");

    console.log("Use journalContract smart contract.");
    this.contract = await network.getContract("journalContract");
  }

  async getAllArticles() {
    return await this.contract.evaluateTransaction("getAllArticles");
  }

  async getArticle(title) {
    return await this.contract.evaluateTransaction("getArticle", title);
  }

  async addArticle(title, cid) {
    const addArticleResponse = await this.contract.submitTransaction(
      "addArticle",
      title,
      cid
    );
  }
}
