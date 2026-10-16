/**
 * ╔══════════════════════════════════════╗
 * ║          WOW VIDEO V4                ║
 * ║       Random Video Sender            ║
 * ║  Credit: HRIDOY HASAN SHANTO          ║
 * ╚══════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "wow",
    aliases: ["🤯", "wowvideo"],
    version: "4.0.0",
    author: "💠 HRIDOY HASAN SHANTO 💠",
    countDown: 5,
    role: 0,
    shortDescription: "Random WOW video",
    longDescription: "Send a random WOW video with a stylish caption",
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    const videos = [
      "https://files.catbox.moe/xvc8bc.mp4",
      "https://files.catbox.moe/lh36zw.mp4",
      "https://files.catbox.moe/11uan9.mp4",
      "https://files.catbox.moe/po00n0.mp4",
      "https://files.catbox.moe/yd0ksc.mp4",
      "https://files.catbox.moe/1erfnm.mp4",
      "https://files.catbox.moe/lfixr7.mp4",
      "https://files.catbox.moe/x9l4bc.mp4",
      "https://files.catbox.moe/otg4r7.mp4",
      "https://files.catbox.moe/k8ka02.mp4",
      "https://files.catbox.moe/8otg7n.mp4",
      "https://files.catbox.moe/f9apxr.mp4",
      "https://files.catbox.moe/m81rkr.mp4"
    ];

    const captions = [
      "🤯 ওয়াও! এটা আবার কী দেখলাম! 🔥",
      "😳 ভাই এটা তো লেভেল ছাড়িয়ে গেল!",
      "😂 এটা দেখে হাসি আটকানো দায়! 🤣",
      "🔥 Pure WOW Moment! 🤯",
      "👀 শেষটা দেখার মতো ছিল! 😱",
      "🤯 Brain.exe Has Stopped Working! 😂",
      "😎 এটাই তো আসল বিনোদন!",
      "🤣 ভাই ভিডিওটা মারাত্মক!",
      "😱 এমন জিনিস আগে দেখি নাই!",
      "🔥 দেখেই মুড ফ্রেশ!",
      "🤯 কল্পনারও বাইরে!",
      "😎 Just WOW! 🔥",
      "😂 ভাই ভিডিওটা জমে গেছে!",
      "👀 দেখো আর অবাক হও!",
      "🔥 ভালো লাগলে একটা React দিও!"
    ];

    const cacheDir = path.join(__dirname, "cache");
    let filePath = null;

    try {
      await fs.ensureDir(cacheDir);

      let name = "বন্ধু";

      try {
        if (event && event.senderID && usersData) {
          const user = await usersData.get(event.senderID);
          if (user && user.name) name = user.name;
        }
      } catch (_) {}

      const caption =
        captions[Math.floor(Math.random() * captions.length)];

      // Random video order; retry other URLs if one fails.
      const shuffled = [...videos].sort(() => Math.random() - 0.5);
      let downloaded = false;
      let lastError = null;

      for (let i = 0; i < Math.min(4, shuffled.length); i++) {
        const video = shuffled[i];
        filePath = path.join(
          cacheDir,
          `wow_${Date.now()}_${i}.mp4`
        );

        try {
          const response = await axios.get(video, {
            responseType: "stream",
            timeout: 90000,
            maxRedirects: 5,
            validateStatus: status => status >= 200 && status < 300,
            headers: {
              "User-Agent": "Mozilla/5.0"
            }
          });

          const contentType = String(
            response.headers["content-type"] || ""
          ).toLowerCase();

          if (
            contentType.includes("text/html") ||
            contentType.includes("application/json")
          ) {
            response.data.destroy();
            throw new Error("URL returned a webpage instead of a video");
          }

          const writer = fs.createWriteStream(filePath);

          await new Promise((resolve, reject) => {
            response.data.on("error", reject);
            writer.on("error", reject);
            writer.on("finish", resolve);
            response.data.pipe(writer);
          });

          const stat = await fs.stat(filePath);

          if (!stat.size) {
            throw new Error("Downloaded file is empty");
          }

          downloaded = true;
          break;
        } catch (error) {
          lastError = error;
          await fs.remove(filePath).catch(() => {});
          filePath = null;
        }
      }

      if (!downloaded || !filePath) {
        throw lastError || new Error("All video URLs failed");
      }

      const body =
        `╭━━━〔 🤯 WOW VIDEO 〕━━━╮\n` +
        `┃ 👤 ${name}\n` +
        `┃\n` +
        `┃ ${caption}\n` +
        `┃ 💠 HRIDOY HASAN SHANTO 💠\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯`;

      // Wait until the bot's reply operation completes.
      await message.reply({
        body,
        attachment: fs.createReadStream(filePath)
      });

    } catch (error) {
      console.error(
        "[WOW V4 ERROR]",
        error.code || "",
        error.message || error
      );

      try {
        await message.reply(
          "😿 ভিডিও পাঠানো যায়নি!\n" +
          "💠 HRIDOY HASAN SHANTO 💠\n\n" +
          "🔄 ভিডিও লিংক অথবা Bot Logs পরীক্ষা করুন।"
        );
      } catch (replyError) {
        console.error("[WOW REPLY ERROR]", replyError.message);
      }
    } finally {
      if (filePath) {
        setTimeout(() => {
          fs.remove(filePath).catch(() => {});
        }, 60000);
      }
    }
  }
};
