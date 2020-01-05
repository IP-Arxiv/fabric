import { FileSystemWallet, Gateway } from "fabric-network";
import * as yaml from "js-yaml";
import * as path from "path";

const ccpPath = path.resolve(
  __dirname,
  "..",
  "..",
  "network",
  "connection-ipa.yaml"
);

async function main() {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const adminExists = await wallet.exists("admin");
    if (!adminExists) {
      console.log(
        'An identity for the user "admin" does not exist in the wallet'
      );
      console.log("Run the enrollAdmin.ts application before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true }
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

main();
