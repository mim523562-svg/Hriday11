const axios = require("axios");

module.exports.config = {
  name: "uff",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Random Video Reply",
  commandCategory: "Fun",
  usages: "uff",
  cooldowns: 5
};

const videos = [
  "https://i.imgur.com/0l5UhmS.mp4",
  "https://i.imgur.com/O3rar4t.mp4",
  "https://i.imgur.com/ef28GQa.mp4",
  "https://i.imgur.com/IhbvVXY.mp4",
  "https://i.imgur.com/sttfCpY.mp4",
  "https://i.imgur.com/Fz6MY3p.mp4",
  "https://i.imgur.com/hqcPTYa.mp4",
  "https://i.imgur.com/Q6NCh9l.mp4",
  "https://i.imgur.com/LL699S0.mp4",
  "https://i.imgur.com/VnP3rNL.mp4",
  "https://i.imgur.com/gtUOcys.mp4",
  "https://i.imgur.com/QQXBDqX.mp4",
  "https://i.imgur.com/FUaM2vb.mp4",
  "https://i.imgur.com/DE6DOAu.mp4",
  "https://i.imgur.com/hPC7lCB.mp4",
  "https://i.imgur.com/W3iA7JK.mp4",
  "https://i.imgur.com/YNQjOUz.mp4",
  "https://i.imgur.com/ZkRsBm9.mp4",
  "https://i.imgur.com/VPnGC51.mp4",
  "https://i.imgur.com/XA1hjYn.mp4",
  "https://i.imgur.com/R7CWS6I.mp4",
  "https://i.imgur.com/tFEJvku.mp4",
  "https://i.imgur.com/qA6N92o.mp4",
  "https://i.imgur.com/yxFA0j8.mp4",
  "https://i.imgur.com/O8eVk6V.mp4",
  "https://i.imgur.com/R0sXUMC.mp4",
  "https://i.imgur.com/AY0egd1.mp4",
  "https://i.imgur.com/maqUqQr.mp4",
  "https://i.imgur.com/dZUaLxs.mp4",
  "https://i.imgur.com/NsGQ6DN.mp4",
  "https://i.imgur.com/OBbOS03.mp4"
];

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const video =
    videos[Math.floor(Math.random() * videos.length)];

  const message = `╭━━━〔  riya hat marbe naki〕━━━╮
┃
┃ দেখ আবার হাত মারিস না 🫦🥵 
┃
┃ 💠 Developer: হৃদয় হাসান শান্ত
┃ 🎬 Total Videos: ${videos.length}
┃ 🎥 Enjoy Your Video!
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

  try {
    const response = await axios.get(video, {
      responseType: "stream",
      timeout: 30000,
      maxRedirects: 5
    });

    await new Promise((resolve, reject) => {
      api.sendMessage(
        {
          body: message,
          attachment: response.data
        },
        threadID,
        (err, info) => {
          if (err) return reject(err);
          resolve(info);
        },
        messageID
      );
    });

  } catch (error) {
    console.error("[UFF VIDEO ERROR]", error.message);

    return api.sendMessage(
      `😿 ভিডিও পাঠানো যায়নি!\n\n` +
      `💠 HRIDOY BOT\n` +
      `🔄 আবার চেষ্টা করো অথবা ভিডিও লিংক পরীক্ষা করো।`,
      threadID,
      messageID
    );
  }
};
