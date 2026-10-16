
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "uff",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Random video sender",
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
  const cacheDir = path.join(__dirname, "cache");
  let filePath = null;

  try {
    await fs.ensureDir(cacheDir);

    const shuffled = [...videos].sort(
      () => Math.random() - 0.5
    );

    let downloaded = false;
    let lastError;

    for (let i = 0; i < Math.min(4, shuffled.length); i++) {
      filePath = path.join(
        cacheDir,
        `uff_${Date.now()}_${i}.mp4`
      );

      try {
        const response = await axios.get(shuffled[i], {
          responseType: "arraybuffer",
          timeout: 60000,
          maxRedirects: 5,
          maxContentLength: 40 * 1024 * 1024,
          validateStatus: status => status === 200,
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        const data = Buffer.from(response.data);
        const type = String(
          response.headers["content-type"] || ""
        ).toLowerCase();

        if (
          !data.length ||
          type.includes("text/html") ||
          type.includes("application/json")
        ) {
          throw new Error("Invalid video response");
        }

        await fs.writeFile(filePath, data);
        downloaded = true;
        break;
      } catch (err) {
        lastError = err;
        await fs.remove(filePath).catch(() => {});
        filePath = null;
      }
    }

    if (!downloaded || !filePath) {
      throw lastError || new Error("No video URL available");
    }

    const caption =
      "╭━━━〔 🎬 UFF VIDEO 〕━━━╮\n" +
      "┃ 🤯 WOW! RANDOM VIDEO\n" +
      "┃ 🎥 Total Videos: " + videos.length + "\n" +
      "┃ ❤️ ভালো লাগলে React দিও\n" +
      "┃\n" +
      "┃ 💠 HRIDOY HASAN SHANTO 💠\n" +
      "╰━━━━━━━━━━━━━━━━━━━━╯";

    await new Promise((resolve, reject) => {
      const attachment = fs.createReadStream(filePath);

      attachment.once("error", reject);

      api.sendMessage(
        { body: caption, attachment },
        threadID,
        (err, info) => {
          if (err) return reject(err);
          resolve(info);
        },
        messageID
      );
    });

  } catch (error) {
    console.error(
      "[UFF VIDEO ERROR]",
      error.code || "",
      error.message || error
    );

    return api.sendMessage(
      "😿 ভিডিও পাঠানো যায়নি!\n" +
      "💠 HRIDOY HASAN SHANTO 💠\n" +
      "🔄 ভিডিও লিংক অথবা Railway Logs পরীক্ষা করো।",
      threadID,
      messageID
    );

  } finally {
    if (filePath) {
      setTimeout(() => {
        fs.remove(filePath).catch(() => {});
      }, 60000);
    }
  }
};
