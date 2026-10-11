const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "admin",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Display Owner Profile",
  commandCategory: "Information",
  usages: "",
  cooldowns: 5
};

const IMAGE_URL = "https://i.imgur.com/rNQJ9OA.jpeg";
const FACEBOOK = "https://www.facebook.com/share/1DQCCDQ1iV/";

module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  if (event.body.trim().toLowerCase() === "admin") {
    return module.exports.run({ api, event });
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const cacheDir = __dirname + "/cache";
  const imagePath = cacheDir + "/hriday-admin.jpg";

  const updatedTime = moment()
    .tz("Asia/Kuala_Lumpur")
    .format("DD/MM/YYYY hh:mm:ss A");

  const msg = `
╭━━━〔 💠 ADMIN PROFILE 💠 〕━━━╮
┃
┃ 👑 𝐍𝐀𝐌𝐄 : হৃদয় হাসান শান্ত
┃ 💎 𝐍𝐈𝐂𝐊𝐍𝐀𝐌𝐄 : শান্ত ভাই
┃ 🚹 𝐆𝐄𝐍𝐃𝐄𝐑 : Male
┃ 😎 𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 : নিজের মতো চলি
┃ 🎮 𝐆𝐀𝐌𝐈𝐍𝐆 : Game Lover
┃ 💼 𝐏𝐑𝐎𝐅𝐄𝐒𝐒𝐈𝐎𝐍 : প্রবাসী জীবন
┃ ❤️ 𝐑𝐄𝐋𝐀𝐓𝐈𝐎𝐍 : Single Boy
┃ 🎂 𝐀𝐆𝐄 : 21+
┃ 🏡 𝐇𝐎𝐌𝐄 : বগুড়া, বাংলাদেশ 🇧🇩
┃ 🌏 𝐂𝐔𝐑𝐑𝐄𝐍𝐓 : Malaysia 🇲🇾
┃
┣━━━━━━━━━━━━━━━━━━
┃ 🌐 𝐒𝐎𝐂𝐈𝐀𝐋 𝐌𝐄𝐃𝐈𝐀
┣━━━━━━━━━━━━━━━━━━
┃ 📘 Facebook:
┃ ${FACEBOOK}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 💫 𝐌𝐘 𝐒𝐓𝐀𝐓𝐔𝐒
┣━━━━━━━━━━━━━━━━━━
┃ 👑 নিজের গল্পের নায়ক নিজেই
┃ 🤫 কম কথা, বেশি কাজ
┃ 💖 সম্মান দিলে সম্মান পাবে
┃
┣━━━━━━━━━━━━━━━━━━
┃ 🕒 UPDATED INFORMATION
┣━━━━━━━━━━━━━━━━━━
┃ ${updatedTime}
┃
╰━━━〔 💠 HRIDOY BOT 💠 〕━━━╯
       💖 POWERED BY HRIDOY
`;

  try {
    await fs.ensureDir(cacheDir);

    const response = await axios.get(IMAGE_URL, {
      responseType: "arraybuffer",
      timeout: 15000
    });

    await fs.writeFile(imagePath, response.data);

    return api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(imagePath)
      },
      threadID,
      err => {
        fs.unlink(imagePath).catch(() => {});
        if (err) console.error("[ADMIN SEND ERROR]", err);
      },
      messageID
    );
  } catch (error) {
    console.error("[ADMIN ERROR]", error);

    return api.sendMessage(
      msg,
      threadID,
      null,
      messageID
    );
  }
};
