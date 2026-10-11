const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "wow",
    aliases: ["🤯", "wowvideo"],
    version: "3.0.0",
    author: "হৃদয় হাসান শান্ত",
    countDown: 5,
    role: 0,
    shortDescription: "Random Wow 🤯 video",
    longDescription: "Random Wow video with stylish captions",
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
      "😳 ভাই এটা তো লেভেল ছাড়িয়ে গেল! 🔥",
      "😂 এটা দেখে হাসি আটকানো দায়! 🤣",
      "🔥 Pure WOW Moment! 🤯",
      "👀 শেষটা দেখার মতো ছিল! 😱",
      "🤯 Brain.exe Has Stopped Working! 😂",
      "😎 এটাই তো আসল বিনোদন! 🔥",
      "🤣 ভাই ভিডিওটা মারাত্মক! 🤯",
      "😱 এমন জিনিস আগে দেখি নাই! 👀",
      "🔥 দেখেই মুড ফ্রেশ! 😎",
      "😂 কে বানাইছে এই জিনিস! 🤣",
      "🤯 মাথা নষ্ট করে দিলো! 😂",
      "👀 একবার দেখলে বারবার দেখতে ইচ্ছে করবে! 🔥",
      "😳 এটা কি সত্যি নাকি! 🤯",
      "🤣 হাসতে হাসতে শেষ! 😂",
      "🔥 ভিডিওটা এক কথায় আগুন! 🔥",
      "😎 WOW মানেই WOW! 🤯",
      "😂 ভাই থামো, আর পারছি না! 🤣",
      "👀 সবাই শেষ পর্যন্ত দেখো! 😱",
      "🤯 এইটার জন্য একটা WOW তো প্রাপ্য! 🔥",
      "😳 দেখার পর আমিও চুপ! 😂",
      "🔥 আজকের সেরা ভিডিও! 🤯",
      "🤣 এমন ভিডিও পেলে স্ক্রল করা যায় না! 👀",
      "😎 Mood Off? এটা দেখো! 😂",
      "🤯 কল্পনারও বাইরে! 🔥",
      "😱 শেষের সিনটা অসাধারণ! 👀",
      "😂 এই ভিডিওটা কে বানাইছে ভাই! 🤣",
      "🔥 Level: Impossible! 🤯",
      "👀 চোখ সরানো যাচ্ছে না! 😳",
      "🤣 হাসির গ্যারান্টি! 😂",
      "🤯 এইটা দেখে আমার সিস্টেম হ্যাং! 😂",
      "😎 Just WOW! 🔥",
      "😳 এমন কাণ্ড কেউ করে! 🤯",
      "🔥 পুরাই আগুন ভিডিও! 😎",
      "😂 ভাই ভিডিওটা জমে গেছে! 🤣",
      "👀 দেখো আর অবাক হও! 🤯",
      "😱 এটা মিস করলে আফসোস! 🔥",
      "🤣 হাসতে হাসতে চোখে পানি! 😂",
      "🤯 এই দৃশ্যটা দেখার মতো! 👀",
      "🔥 একদম ফাটাফাটি! 😎",
      "😳 আমার তো বিশ্বাসই হচ্ছে না! 🤯",
      "😂 আজকে হাসির ডোজ হয়ে গেল! 🤣",
      "👀 সবাই একটু দেখো তো! 🔥",
      "🤯 WOW এরও উপরে কিছু থাকলে এটা! 😱",
      "😎 ভিডিও ভালো লাগলে ❤️ দিও!",
      "🔥 ভালো লাগলে একটা React দিও! 🤍",
      "😂 কেমন লাগলো কমেন্টে জানাও! 👀",
      "🤯 আবারও বলি—WOW! 🔥",
      "😱 শেষ পর্যন্ত না দেখলে মিস! 👀",
      "🤣 এই ভিডিওর কোনো তুলনা নাই! 🔥",
      "😎 আজকের Entertainment Done! 🤯"
    ];

    const emojis = [
      "🔥",
      "😳",
      "😂",
      "🔥",
      "😱",
      "👀",
      "🤣",
      "😎"
    ];

    try {
      const video = videos[Math.floor(Math.random() * videos.length)];
      const caption =
        captions[Math.floor(Math.random() * captions.length)];
      const emoji =
        emojis[Math.floor(Math.random() * emojis.length)];

      let name = "Everyone";

      try {
        if (event.senderID && usersData) {
          const userInfo = await usersData.get(event.senderID);
          if (userInfo && userInfo.name) {
            name = userInfo.name;
          }
        }
      } catch (e) {
        name = "Everyone";
      }

      const body =
        `╭━━━〔 🤯 WOW VIDEO 〕━━━╮\n` +
        `┃ 👤 ${name}\n` +
        `┃\n` +
        `┃ ${caption}\n` +
        `┃ ${emoji}\n` +
        `╰━━━━━━━━━━━━━━━━━━╯`;

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(
        cacheDir,
        `wow_${Date.now()}.mp4`
      );

      const response = await axios({
        method: "GET",
        url: video,
        responseType: "stream",
        timeout: 60000
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await message.reply({
        body,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => {
        fs.remove(filePath).catch(() => {});
      }, 15000);

    } catch (error) {
      console.error("WOW VIDEO ERROR:", error);
      return message.reply(
        "❌ ভিডিও পাঠাতে সমস্যা হয়েছে!\n\n🔄 একটু পরে আবার চেষ্টা করুন।"
      );
    }
  }
};
