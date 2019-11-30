const express = require("express");
const youtube = require("youtube-api");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const uuid = require("uuid/v4");
const open = require("open");
const credentials = require("./credentials.json");

const app = express();

app.use(express.json());
app.use(cors({ origin: 3000 }));

// const oAuth = youtube.authenticate({
//   type: "oauth",
//   client_id: credentials.web.client_id,
//   client_secret: credentials.web.client_secret,
//   redirect_url: credentials.web.redirect_uris[0]
// });

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
