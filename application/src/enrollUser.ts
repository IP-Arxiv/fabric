import { FileSystemWallet, Gateway, X509WalletMixin } from "fabric-network";
import * as path from "path";

enum Role {
  author = "author"
}

const ccpPath = path.resolve(
  __dirname,
  "..",
  "..",
  "network",
  "connection-ipa.yaml"
);

async function enrollUser(enrollmentID: string, role: Role) {
  try {
    console.log("the role", role);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(enrollmentID);
    if (userExists) {
      console.log(
        `An identity for the user "${enrollmentID}" already exists in the wallet`
      );
      return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists("admin");
    if (!adminExists) {
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet'
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

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: "ipa.journal",
        enrollmentID,
        role
      },
      adminIdentity
    );
    const enrollment = await ca.enroll({
      enrollmentID,
      enrollmentSecret: secret
    });
    const userIdentity = X509WalletMixin.createIdentity(
      "IPAOrgMSP",
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import(enrollmentID, userIdentity);
    console.log(
      "Successfully registered and enrolled admin user ${enrollmentID} and imported it into the wallet"
    );
  } catch (error) {
    console.error(`Failed to register user "user1": ${error}`);
    process.exit(1);
  }
}

module.exports = { enrollUser, Role };
