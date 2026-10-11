module.exports.config = {
 name: "fork",
 version: "2.0.4",
 hasPermssion: 0,
 credits: "乛 Šħẫňto Hřiȡẫy Ħẫššẫň",
 description: "Stable fork system",
 commandCategory: "other",
 usages: "fork",
 cooldowns: 3,
};

const fs = require("fs-extra");
const axios = require("axios");

module.exports.run = async function({ api, event }) {

 const repo = "https://www.facebook.com/share/1DQCCDQ1iV/";
 const repoLink = `https://github.com/${repo}`;

 const msg = `
━━━━━━━━━━━━━━━━━━━━━━
乛 Šħẫňto Hřiȡẫy Ħẫššẫň
𝗕𝗢𝗦𝗦 𝗔𝗥 𝗙𝗢𝗥𝗞 𝗟𝗶𝗡𝗞
━━━━━━━━━━━━━━━━━━━━━━

📌 Repo: ${repoLink}

━━━━━━━━━━━━━━━━━━━━━━
Šħẫňto Hřiȡẫy Ħẫššẫň
━━━━━━━━━━━━━━━━━━━━━━
`;

 const imageUrl = "https://i.imgur.com/rNQJ9OA.jpeg";
 const path = __dirname + "/cache/fork.jpg";

 try {
 const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
 fs.writeFileSync(path, Buffer.from(img.data));

 return api.sendMessage({
 body: msg,
 attachment: fs.createReadStream(path)
 }, event.threadID, () => fs.unlinkSync(path), event.messageID);

 } catch (e) {
 return api.sendMessage(msg, event.threadID, event.messageID);
 }
};
