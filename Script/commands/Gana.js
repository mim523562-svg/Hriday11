const fs = require("fs");
const axios = require("axios");
const path = require("path");

let lastPlayed = -1;

// 🔐 AUTHOR LOCK (DO NOT CHANGE)
const AUTHOR_LOCK = "FARHAN-KHAN";

module.exports.config = {
  name: "🙊",
  version: "1.0.2",
  hasPermssion: 0,
  credits: AUTHOR_LOCK,
  description: "Play random song",
  commandCategory: "media",
  usages: "",
  cooldowns: 1
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  // 🔐 AUTHOR LOCK
  if (module.exports.config.credits !== AUTHOR_LOCK) {
    return api.sendMessage(
      "⛔ Author lock failed! File modified.",
      threadID,
      messageID
    );
  }

  const songLinks = [

 "https://files.catbox.moe/23e8u1.mp3",
    "https://files.catbox.moe/y6jfa9.mp3",
    "https://files.catbox.moe/nl37p2.mp3",
    "https://files.catbox.moe/yayaje.mp3",
    "https://files.catbox.moe/zj2ycp.mp3",
    "https://files.catbox.moe/c64ysq.mp3",
    "https://files.catbox.moe/yayaje.mp3",
    "https://files.catbox.moe/7fx67i.mp3",
    "https://files.catbox.moe/lkuhqo.mp3",
    "https://files.catbox.moe/ovfrol.mp3",
    "https://files.catbox.moe/zj2ycp.mp3",
    "https://files.catbox.moe/lkuhqo.mp3",
    "https://files.catbox.moe/c64ysq.mp3",
  ];

  if (!songLinks.length) {
    return api.sendMessage("❌ No songs found!", threadID, messageID);
  }

  let index;
  do {
    index = Math.floor(Math.random() * songLinks.length);
  } while (index === lastPlayed && songLinks.length > 1);

  lastPlayed = index;

  const filePath = path.join(__dirname, "cache", `song_${index}.mp3`);

  try {
    const response = await axios({
      url: songLinks[index],
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: "🎶 Here's your random song 🎧",
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage("❌ Failed to send song!", threadID, messageID);
    });

  } catch (e) {
    api.sendMessage("⚠️ Failed to download song!", threadID, messageID);
  }
};
