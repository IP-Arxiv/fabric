const user = require("./dist/enrollUser");
const admin = require("./dist/enrollAdmin");

async function main() {
  await admin.enrollAdmin();
  await user.enrollUser("author", "author");
}

main();
