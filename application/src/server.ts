const express = require("express");
const bodyParser = require("body-parser");
const user = require("./enrollUser");
const articles = require("./addArticle");

const port = 3000;
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/test", (req, res) => res.send("jojo"));

/**
 * Registers and enrolls a new user, which can execute chaincode.
 * @param enrollmentID Aka the username.
 * @param role Role of the user. Used for access control.
 */
app.post("/addUser", (req, res) => {
  const body = req.body;
  const enrollmentID = body.enrollmentID;
  const role = body.role;

  // chk needed properties
  if (!enrollmentID) res.status(400).send("enrollmentID is missing.");
  if (!role) res.status(400).send("role is missing.");
  if (!(role in user.Role))
    res.status(400).send(`${role} is not a valid role.`);

  user
    .enrollUser(enrollmentID, role)
    .then(() =>
      res.send(`Created user: "${enrollmentID}" with role: "${role}".`)
    );
});

app.get("/articles/:title", (req, res) => {
  res.status(500).send("not implemented");
});

app.post("/articles/:title", (req, res) => {
  const title = req.params.title;
  const username = req.body.username;

  if (!username) res.status(400).send("username is missing.");

  articles.addArticle(title, username).then(() => {
    res.send(`Article: ${title} has been added`);
  });
});

app.patch("/article", (req, res) => {});

app.get("/logCtx", (req, res) => {
  const journalC = new articles.journalContract();
  journalC.logCtx("authorWithRole").then(() => res.send("loged ctx"));
});

app.listen(port, () => console.log(`IPA Express listening on port ${port}!`));
