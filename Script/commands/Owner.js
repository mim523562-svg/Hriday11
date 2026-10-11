const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "owner",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Display bot owner's information",
  commandCategory: "Information",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const imageURL = "https://i.imgur.com/rNQJ9OA.jpeg";
  const cacheDir = __dirname + "/cache";
  const imagePath = cacheDir + "/hriday-owner.jpg";

  const ownerInfo = `
╭━━━〔 👑 OWNER PROFILE 👑 〕━━━╮
┃
┃ 💠 𝗡𝗔𝗠𝗘
┃ হৃদয় হাসান শান্ত
┃
┃ 😎 𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘
┃ শান্ত ভাই 💫
┃
┃ 🏠 𝗛𝗢𝗠𝗘
┃ বগুড়া, বাংলাদেশ 🇧🇩
┃
┃ 💼 𝗣𝗥𝗢𝗙𝗘𝗦𝗦𝗜𝗢𝗡
┃ প্রবাসী জীবন 🇲🇾
┃
┃ 🌐 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞
┃ https://www.facebook.com/share/1DQCCDQ1iV/
┃
┃ 💖 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣
┃ Single Boy 😎
┃
┃ 💬 𝗔𝗧𝗧𝗜𝗧𝗨𝗗𝗘
┃ নিজের রাজ্যে নিজেই রাজা 👑
┃
┃ 😂 𝗪𝗔𝗥𝗡𝗜𝗡𝗚
┃ বেশি প্যারা দিলে
┃ শান্ত ভাই অফলাইনে! 🤫
┃
┃ ⏰ 𝗔𝗖𝗧𝗜𝗩𝗘
┃ WiFi থাকলে অনলাইন 📶
┃
┃ ✨ 𝗤𝗨𝗢𝗧𝗘
┃ "নীরবতা আমার স্টাইল,
┃ আর হাসি আমার পরিচয়!" 💫
┃
┣━━━━━━━━━━━━━━━━━━
┃ 🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
┣━━━━━━━━━━━━━━━━━━
┃ 💠 Bot: HRIDOY BOT
┃ 👑 Developer: হৃদয় হাসান শান্ত
┃
╰━━━〔 💖 THANK YOU 💖 〕━━━╯
`;

  try {
    await fs.ensureDir(cacheDir);

    const response = await axios.get(imageURL, {
      responseType: "arraybuffer",
      timeout: 15000
    });

    await fs.writeFile(imagePath, response.data);

    return api.sendMessage(
      {
        body: ownerInfo,
        attachment: fs.createReadStream(imagePath)
      },
      threadID,
      (err) => {
        fs.unlink(imagePath).catch(() => {});
        if (err) console.error("[OWNER SEND ERROR]", err);
      },
      messageID
    );
  } catch (error) {
    console.error("[OWNER ERROR]", error);

    return api.sendMessage(
      ownerInfo,
      threadID,
      null,
      messageID
    );
  }
};
