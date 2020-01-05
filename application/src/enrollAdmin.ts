import * as FabricCAServices from "fabric-ca-client";
import { FileSystemWallet, X509WalletMixin } from "fabric-network";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

const ccpPath = path.resolve(
  __dirname,
  "..",
  "..",
  "network",
  "connection-ipa.yaml"
);
const ccp = yaml.safeLoad(fs.readFileSync(ccpPath, "utf8"));

async function main() {
  try {
    // Create CA client
    const caInfo = ccp.certificateAuthorities["ca.ipa.com"];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check if admin user is already enrolled
    const adminExists = await wallet.exists("admin");
    if (adminExists) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
    }

    // Enroll the admin user, import the new identity to the wallet
    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw"
    });

    const identity = X509WalletMixin.createIdentity(
      "IPAMSP",
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import("admin", identity);
    console.log(
      'Successfully enrolled admin user "admin" and imported him into the wallet'
    );
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
  }
}

main();
