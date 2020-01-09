const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const user = require("./enrollUser");
const stream = require("stream");
import { IPFS } from "./ipfs";
import { Journal } from "./addArticle";

const port = 3000;
const app = express();
const upload = multer();
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/test", (req, res) => res.send("jojo"));

interface Article {
  isPublished: boolean;
  cid: string;
  title: string;
  file: Buffer;
}

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

app.post("/file", upload.single("file"), (req, res) => {
  res.send("ok");
});

app.get("/articles", (req, res) => {
  const journal = new Journal("author");
  journal.init(() => {
    journal
      .getAllArticles()
      .then(allArticles => {
        console.log(JSON.parse(allArticles.toString()));
        res.send(allArticles);
      })
      .catch(err => res.status(500).send(`Error: ${err}`));
  });
});

/**
 * TODO: get title and username from query parameters
 */
app.get("/articles/:title", (req, res) => {
  const journal = new Journal("author");
  journal.init(() => {
    journal
      .getArticle("newTitle")
      .then(response => {
        const article = JSON.parse(response.toString());
        res.send(article);
      })
      .catch(err => {
        res.status(500).send(`Error: ${err}`);
      });
  });
});

app.get("/articles/download/:cid", (req, res) => {
  const cid = req.params.cid;
  if (!cid) {
    res.status(400).send("Missing CID.");
    return;
  }

  IPFS.getFile(cid).then(file => {
    const readStream = new stream.PassThrough();
    readStream.end(file);

    res.set("Content-disposition", `attachment; filename=${cid}`);
    res.set("Content-type", "application/pdf");

    readStream.pipe(res);
  });
});

app.post("/articles/:title", upload.single("file"), (req, res) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).send("username is missing.");
    return;
  }

  const file = req.file;
  if (typeof file === "undefined") {
    res.status(400).send("file is missing.");
    return;
  }
  const fileBuffer = file.buffer;

  const title = req.params.title;

  const journal = new Journal("author");
  journal.init(() => {
    IPFS.addFile(fileBuffer)
      .then(response => {
        const cid = response[0].hash;

        return journal.addArticle(title, cid);
      })
      .then(() => {
        res.send(`Article: ${title} has been added`);
      })

      .catch(err => console.log(err));
  });
});

app.patch("/article", (req, res) => {});

app.listen(port, () => console.log(`IPA Express listening on port ${port}!`));
