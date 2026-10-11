const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "🫦",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Random video sender",
  commandCategory: "Media",
  usages: ".🫦",
  cooldowns: 5
};

const videos = [
  "https://drive.google.com/uc?id=19Ut381EDTdjYPRnPvy3pQq6oyQ5Y8bq3",
  "https://drive.google.com/uc?id=1BwWdiggrcPRemz3UHtQZ8PxBSexLY_cp",
  "https://drive.google.com/uc?id=1ARSdgb82oP6DsIUi-YxDaZu-XSMOJdz1",
  "https://drive.google.com/uc?id=19A4UI8fCQnFd1Z3aONYNrf2jYsCcoFn4",
  "https://drive.google.com/uc?id=1C2ZX7bRSM04DZ9tKTT3l4oj4Qi2Fbkdt",
  "https://drive.google.com/uc?id=1A1zlmgOTsPoJHmyXDm4T49cmjSbTLgg0",
  "https://drive.google.com/uc?id=18tOHBnG_vrnG_io6Kgj1LPI36-7mDsBy",
  "https://drive.google.com/uc?id=19fhL4nvaVT2ehz93W0DPRVocrczSljaF",
  "https://drive.google.com/uc?id=1AixGc0pxlmpmgHYu5wAbDlYHv2whRqDg",
  "https://drive.google.com/uc?id=1BMuw5bV5I100iACo52fGujoL5vQDlRVA",
  "https://drive.google.com/uc?id=1BenMV3N13x80P-hEG4G8u5opRxm6Vlfc",
  "https://drive.google.com/uc?id=1AUlNoTFOWKSFhRPpjv1KCv48MGpd8r0C",
  "https://drive.google.com/uc?id=1AIeMHRnwQ0SUN0TiPQ32UHyx9eL9cicL",
  "https://drive.google.com/uc?id=1BAMLpNMZQaHhWNKIsjCDFAdTnQvhuQh7",
  "https://drive.google.com/uc?id=1BoUF2w17L9XGnqlqG3JibQr7iP7Anmqs",
  "https://drive.google.com/uc?id=1Bk_ITSsW_RAVKniu69RYVMpqZAT7kABl",
  "https://drive.google.com/uc?id=19erDLH1W5-rOvUHOBNpg0Ur0lS3O88a8",
  "https://drive.google.com/uc?id=1A-yFTjlvltRjyDZEnyQrpmZsYgLQRTbi",
  "https://drive.google.com/uc?id=192VVIzLzmh4hTekLiL_7PeleZUCs5uj3",
  "https://drive.google.com/uc?id=19TcB5dAvlS3-47WWFKvXgZrNlG7l0r0o",
  "https://drive.google.com/uc?id=19gPSfV0_Dx1tE8bOYciUICS7Wk9h4x-l",
  "https://drive.google.com/uc?id=1AHFuEHZ2NhYPaiZDAQZVvZHHuu1DQR13",
  "https://drive.google.com/uc?id=1AcGr8oNrQUxpO8FTBvypImLJu6u0Nehh",
  "https://drive.google.com/uc?id=19cTN8R1si-0a-2HHRl51531B9LeUVGgi",
  "https://drive.google.com/uc?id=1BC7jTudYN-6_BKks4GZwjK3CDFKNtftG",
  "https://drive.google.com/uc?id=19TBwM2CfPgzZ7bNOtbnQxptwHEn03stv",
  "https://drive.google.com/uc?id=1BR50XoBRpCv1oN9WrfPTYx8fNWjSy0Ql"
];

const captions = [
  "🤭 কিরে বন্ধু, ভিডিও দেখবি নাকি? 😹",
  "😂 নে বন্ধু, তোর জন্য একটা ভিডিও!",
  "🙈 চুপচাপ দেখো আর মজা নাও!",
  "💫 HRIDOY BOT থেকে তোমার জন্য!",
  "🎬 আজকের স্পেশাল ভিডিও!",
  "😎 ভিডিও ভালো লাগলে রিঅ্যাক্ট দিও!",
  "🤭 Random Video Drop!",
  "💖 Enjoy the video!"
];

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const cacheDir = path.join(__dirname, "cache");
  const filePath = path.join(cacheDir, `hriday_${Date.now()}.mp4`);

  try {
    await fs.ensureDir(cacheDir);

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const video = videos[Math.floor(Math.random() * videos.length)];
    const caption = captions[Math.floor(Math.random() * captions.length)];

    const response = await axios.get(video, {
      responseType: "stream",
      timeout: 120000,
      maxRedirects: 5
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
      response.data.on("error", reject);
    });

    api.sendMessage({
      body:
`╭━━━〔 🤭 HRIDOY VIDEO 〕━━━╮

${caption}

🎬 RANDOM VIDEO
💎 DEVELOPER: হৃদয় হাসান শান্ত

╰━━━〔 💫 ENJOY 〕━━━╯`,
      attachment: fs.createReadStream(filePath)
    }, threadID, (err) => {
      api.setMessageReaction(
        err ? "❌" : "🤭",
        messageID,
        () => {},
        true
      );

      fs.remove(filePath).catch(() => {});
    }, messageID);

  } catch (error) {
    console.error("HRIDOY VIDEO ERROR:", error.message);

    api.setMessageReaction("❌", messageID, () => {}, true);

    api.sendMessage(
      "❌ ভিডিও পাঠানো যায়নি! কিছুক্ষণ পর আবার চেষ্টা করো।",
      threadID
    );

    await fs.remove(filePath).catch(() => {});
  }
};
