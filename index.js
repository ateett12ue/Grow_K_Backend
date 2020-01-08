const express = require("express");
const youtube = require("youtube-api");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const uuid = require("uuid/v4");
const open = require("open");
const credentials = require("./credentials.json");

const app = express();

const storage = multer.diskStorage({
  destination: "./",
  filename(req, file, cb) {
    const newFilename = `${uuid()}-${file.originalname}`;
    cb(null, newFilename);
  }
});

const uploadVideoFile = multer({ storage }).single("videoFile");

app.use(express.json());
app.use(cors({ origin: 3000 }));

const oAuth = youtube.authenticate({
  type: "oauth",
  client_id: credentials.web.client_id,
  client_secret: credentials.web.client_secret,
  redirect_url: credentials.web.redirect_uris
});

app.post("/upload", uploadVideoFile, (req, res) => {
  if (req.file) {
    const { title, description } = req.body;
    oAuth.generateAuthUrl({
      access_type: "offline",
      scope: "http://www.googleapis.com/auth/video.upload",
      state: JSON.stringify({ filename: req.file.filename, title, description })
    });
  }
});

app.get("/oauth2callback", (req, res) => {
  res.redirect("http://localhost:3000/uploadVideo/Success");
  const { filename, title, description } = JSON.parse(req.query.state);
  oAuth.getTocken(req.query.code, (err, tockens) => {
    if (err) {
      return console.error(err);
    }
    oAuth.setCredentials(tockens);
    youtube.videos.insert(
      {
        resource: {
          snippet: { title, description },
          status: { privacyStatus: "private" }
        },
        part: "snippet,status",
        media: {
          body: fs.createReadStream(filename)
        }
      },
      (err, data) => {
        console.log("Done.");
        process.exit();
      }
    );
  });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
