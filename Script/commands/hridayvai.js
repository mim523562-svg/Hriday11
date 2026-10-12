const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "hridayvai",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "No Prefix Owner Reply",
  commandCategory: "Fun",
  usages: "hridayvai",
  cooldowns: 5
};

module.exports.handleEvent = function ({
  api,
  event
}) {
  const { threadID, messageID, body, senderID } = event;

  if (!body) return;

  const message = body.toLowerCase().trim();

  const triggers = [
    "@Šħẫňto Hřiȡẫy Ħẫššẫň",
    "hriday vai",
    "hridayvai",
    "হৃদয়",
    "হৃদয়",
    "হৃদয় ভাই",
    "হৃদয় ভাই",
    "হৃদয় হাসান শান্ত"
  ];

  if (!triggers.includes(message)) return;

  const imagePath = path.join(
    __dirname,
    "noprefix",
    "Hriday.png"
  );

  const reply = {
    body: "💠 HRIDOY HASAN SHANTO 💠",
  };

  if (fs.existsSync(imagePath)) {
    reply.attachment = fs.createReadStream(imagePath);
  }

  api.sendMessage(reply, threadID, messageID);

  if (typeof api.setMessageReaction === "function") {
    api.setMessageReaction(
      "💙",
      messageID,
      () => {},
      true
    );
  }
};

module.exports.run = function () {};
