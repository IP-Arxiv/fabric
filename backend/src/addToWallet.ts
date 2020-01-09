"use-strict";

import * as fs from "fs";
import { FileSystemWallet, X509WalletMixin } from "fabric-network";
import * as path from "path";

const fixtures = path.resolve(__dirname, "../../network");

const wallet = new FileSystemWallet("./identity/user/dirk/wallet");

async function main() {
  try {
    const credPath = path.join(
      fixtures,
      "/crypto-config/peerOrganizations/org.ipa.com/users/User1@org.ipa.com"
    );

    // Identity to credentials to be stored in the wallet
    const cert = fs
      .readFileSync(
        path.join(credPath, "/msp/signcerts/User1@org.ipa.com-cert.pem")
      )
      .toString();
    const key = fs
      .readFileSync(
        path.join(
          credPath,
          "/msp/keystore/d6572ca16e5f267a2cdf7b167dd21822bfda2182632997f19c2c5124a5b0cdd3_sk"
        )
      )
      .toString();

    // Load credentials into wallet
    const identityLabel = "User1@org.ipa.com";
    const identity = X509WalletMixin.createIdentity("IPAOrgMSP", cert, key);

    await wallet.import(identityLabel, identity);
  } catch (error) {
    console.error(`Error adding to wallet. ${error}`);
    console.log(error.stack);
  }
}

main().then(() => {
  console.log("done");
});
