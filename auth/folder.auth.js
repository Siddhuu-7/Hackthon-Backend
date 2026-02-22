const crypto = require("crypto");
const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/auth", (req, res) => {

  const token = crypto.randomBytes(16).toString("hex");

  const expire = Math.floor(Date.now() / 1000) + 600;

  const fileName = req.query.fileName;
  const folder = "/pptUploads";
  const useUniqueFileName = "true";

  const stringToSign =
    `fileName=${fileName}&folder=${folder}&token=${token}&expire=${expire}&useUniqueFileName=${useUniqueFileName}`;

  const signature = crypto
    .createHmac("sha1", process.env.PRAVITEKEY)
    .update(stringToSign)
    .digest("hex");

  res.json({
    token,
    expire,
    signature,
    publicKey: process.env.PUBLICKEY
  });

});

module.exports = router;