const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("/ip4/127.0.0.1/tcp/5001");

export class IPFS {
  static async addFile(file: Buffer) {
    return ipfs.add(file);
  }

  static async getFile(cid: string) {
    const files = await ipfs.get(cid);
    return files[0].content;
  }
}
