const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "🪬",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Video Reply Command With Stylish Caption",
  commandCategory: "media",
  usages: "videos1 <keyword>",
  cooldowns: 2
};

const videoMap = {
  "ডাইনি": {
    url: "https://files.catbox.moe/tfaki1.mp4",
    caption:
      "╭━━〔 👻 𝐃𝐀𝐈𝐍𝐈 𝐀𝐋𝐄𝐑𝐓 👻 〕━━╮\n" +
      "😱 ডাইনি ডাকছো কেন রে ভাই!\n" +
      "😂 এখন কিন্তু পালানোর সময়!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "হাসি": {
    url: "https://files.catbox.moe/ovinjk.mp4",
    caption:
      "╭━━〔 😂 𝐇𝐀𝐇𝐀 𝐌𝐎𝐃𝐄 〕━━╮\n" +
      "🤣 হাসতে হাসতে অবস্থা খারাপ!\n" +
      "😆 থাম ভাই, পেট ব্যথা হয়ে যাবে!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "কট": {
    url: "https://files.catbox.moe/wgyhso.mp4",
    caption:
      "╭━━〔 🤣 𝐖𝐇𝐀𝐓?! 〕━━╮\n" +
      "😂 এইটা আবার কী কাণ্ড!\n" +
      "😭 আমি তো কিছুই বুঝলাম না!\n" +
      "╰━━━━━━━━━━━━━━╯"
  },

  "উম্ম": {
    url: "https://files.catbox.moe/l5xxyj.mp4",
    caption:
      "╭━━〔 😚 𝐔𝐌𝐌 𝐌𝐎𝐃𝐄 〕━━╮\n" +
      "🙈 উম্ম বললেই হবে নাকি!\n" +
      "😂 আগে ভালো করে কথা বলো!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "সত্যি না": {
    url: "https://files.catbox.moe/n9iqgv.mp4",
    caption:
      "╭━━〔 🤨 𝐑𝐄𝐀𝐋𝐋𝐘?! 〕━━╮\n" +
      "👀 সত্যি না নাকি?\n" +
      "😂 তাহলে প্রমাণ কোথায় মহাশয়!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "🫣": {
    url: "https://files.catbox.moe/qetiv0.mp4",
    caption:
      "╭━━〔 🫣 𝐒𝐇𝐘 𝐌𝐎𝐃𝐄 〕━━╮\n" +
      "🙈 লজ্জা পাচ্ছো নাকি?\n" +
      "😂 মুখ লুকিয়ে লাভ নেই!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "দেখা করবে": {
    url: "https://files.catbox.moe/lmauvs.mp4",
    caption:
      "╭━━〔 👀 𝐌𝐄𝐄𝐓𝐈𝐍𝐆 〕━━╮\n" +
      "😏 দেখা করবে নাকি?\n" +
      "😂 আগে জায়গাটা বলো!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "😙": {
    url: "https://files.catbox.moe/quap15.mp4",
    caption:
      "╭━━〔 😙 𝐒𝐌𝐈𝐋𝐄 〕━━╮\n" +
      "👀 এই হাসিটা কিন্তু সন্দেহজনক!\n" +
      "😂 কিছু একটা নিশ্চয়ই আছে!\n" +
      "╰━━━━━━━━━━━━━━╯"
  },

  "😆🤸": {
    url: "https://files.catbox.moe/hies6o.mp4",
    caption:
      "╭━━〔 🤸 𝐅𝐔𝐍 𝐌𝐎𝐃𝐄 〕━━╮\n" +
      "🤣 আজকে তো আনন্দের শেষ নাই!\n" +
      "😂 নাচো ভাই, নাচো!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "কল": {
    url: "https://files.catbox.moe/785z5x.mp4",
    caption:
      "╭━━〔 📞 𝐂𝐀𝐋𝐋 𝐓𝐈𝐌𝐄 〕━━╮\n" +
      "📱 কলের কথা উঠতেই হাজির!\n" +
      "😂 এত তাড়া কিসের ভাই?\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "🏍️": {
    url: "https://files.catbox.moe/ph8b0y.mp4",
    caption:
      "╭━━〔 🏍️ 𝐑𝐈𝐃𝐄 𝐓𝐈𝐌𝐄 〕━━╮\n" +
      "💨 বাইক রেডি!\n" +
      "😎 চল, একটু ঘুরে আসি!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "চিপায়": {
    url: "https://files.catbox.moe/iph1ib.mp4",
    caption:
      "╭━━〔 😂 𝐒𝐓𝐔𝐂𝐊 〕━━╮\n" +
      "🤣 চিপায় পড়ে গেছো নাকি!\n" +
      "🙈 বের হওয়ার রাস্তা খুঁজো!\n" +
      "╰━━━━━━━━━━━━━━╯"
  },

  "🥹": {
    url: "https://files.catbox.moe/57fdts.mp4",
    caption:
      "╭━━〔 🥹 𝐄𝐌𝐎𝐓𝐈𝐎𝐍 〕━━╮\n" +
      "🥺 এই মায়াবী মুখ দেখিয়ে লাভ নাই!\n" +
      "😂 আজকে কিন্তু ছাড় নেই!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "🫶": {
    url: "https://files.catbox.moe/pys7u5.mp4",
    caption:
      "╭━━〔 🫶 𝐋𝐎𝐕𝐄 𝐕𝐈𝐁𝐄 〕━━╮\n" +
      "❤️ ভালোবাসা ছড়িয়ে দাও!\n" +
      "✨ সবাই ভালো থাকো!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "লাভ": {
    url: "https://files.catbox.moe/w48i3n.mp4",
    caption:
      "╭━━〔 ❤️ 𝐋𝐎𝐕𝐄 𝐌𝐎𝐃𝐄 〕━━╮\n" +
      "😍 আজকে শুধু ভালোবাসা!\n" +
      "😂 ঝগড়া-ঝাটি বন্ধ!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "লাভ২": {
    url: "https://files.catbox.moe/0hqphz.mp4",
    caption:
      "╭━━〔 💘 𝐋𝐎𝐕𝐄 𝐋𝐄𝐕𝐄𝐋 𝟐 〕━━╮\n" +
      "😍 কাহিনি তো জমে গেছে!\n" +
      "😂 এবার সামলাও!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "love12": {
    url: "https://files.catbox.moe/1f6wdu.mp4",
    caption:
      "╭━━〔 ❤️ 𝐋𝐎𝐕𝐄 𝐌𝐎𝐃𝐄 〕━━╮\n" +
      "😎 𝐋𝐨𝐯𝐞 𝐕𝐢𝐛𝐞𝐬 𝐎𝐧!\n" +
      "✨ আজকে মুডটাই আলাদা!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  },

  "বউ রাব্বি": {
    url: "https://files.catbox.moe/pqdh0d.mp4",
    caption:
      "╭━━〔 😂 𝐑𝐀𝐁𝐁𝐈 𝐌𝐎𝐃𝐄 〕━━╮\n" +
      "👀 রাব্বির বউ কই গেল রে!\n" +
      "🤣 সবাই মিলে খুঁজে দেখো!\n" +
      "╰━━━━━━━━━━━━━━━━╯"
  }
};


// ==============================
// 🔧 Normalize Keyword
// ==============================
function normalizeText(text) {
  return String(text || "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}


// ==============================
// 🎬 COMMAND
// ==============================
module.exports.run = async function ({ api, event, args }) {
  const threadID = event && event.threadID;
  const messageID = event && event.messageID;

  if (!threadID) return;

  try {
    // ==========================
    // 📋 NO KEYWORD
    // ==========================
    if (!args || args.length === 0) {
      const keywords = Object.keys(videoMap)
        .map((key, index) => `${index + 1}. ${key}`)
        .join("\n");

      return api.sendMessage(
        "╭━━〔 🎬 𝐕𝐈𝐃𝐄𝐎𝐒𝟏 〕━━╮\n\n" +
        "📌 Available Keywords:\n\n" +
        keywords +
        "\n\n╰━━━━━━━━━━━━━━━━╯",
        threadID,
        messageID
      );
    }

    // ==========================
    // 🔎 FIND VIDEO
    // ==========================
    const input = normalizeText(args.join(" "));

    let selected = null;
    let selectedKey = null;

    for (const key of Object.keys(videoMap)) {
      if (normalizeText(key) === input) {
        selected = videoMap[key];
        selectedKey = key;
        break;
      }
    }

    // ==========================
    // ❌ NOT FOUND
    // ==========================
    if (!selected) {
      return api.sendMessage(
        "╭━━〔 ❌ 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃 〕━━╮\n\n" +
        "😐 এই নামে কোনো ভিডিও পাওয়া যায়নি!\n\n" +
        "📌 সঠিক keyword ব্যবহার করো।\n" +
        "🎬 ভিডিও লিস্ট দেখতে শুধু লিখো:\n" +
        "👉 videos1\n\n" +
        "╰━━━━━━━━━━━━━━━━╯",
        threadID,
        messageID
      );
    }

    // ==========================
    // 📁 CACHE DIRECTORY
    // ==========================
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    // ==========================
    // 🗂️ SAFE FILE NAME
    // ==========================
    const fileName =
      Buffer.from(selectedKey, "utf8").toString("hex") + ".mp4";

    const filePath = path.join(cacheDir, fileName);

    // ==========================
    // 📥 DOWNLOAD VIDEO
    // ==========================
    if (!(await fs.pathExists(filePath))) {
      const response = await axios({
        method: "GET",
        url: selected.url,
        responseType: "arraybuffer",
        timeout: 60000,
        maxContentLength: 100 * 1024 * 1024,
        maxBodyLength: 100 * 1024 * 1024,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("Downloaded video is empty.");
      }

      await fs.writeFile(filePath, Buffer.from(response.data));
    }

    // ==========================
    // 🎥 SEND VIDEO
    // ==========================
    return api.sendMessage(
      {
        body: selected.caption,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      messageID
    );

  } catch (error) {
    console.error("❌ VIDEOS1 ERROR:", error);

    // Delete broken cache file
    try {
      if (typeof filePath !== "undefined" && await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
    } catch (e) {
      console.error("Cache remove error:", e);
    }

    return api.sendMessage(
      "╭━━〔 ⚠️ 𝐄𝐑𝐑𝐎𝐑 〕━━╮\n\n" +
      "❌ ভিডিও পাঠাতে সমস্যা হয়েছে!\n" +
      "🔄 একটু পরে আবার চেষ্টা করো।\n\n" +
      "╰━━━━━━━━━━━━━━━━╯",
      threadID,
      messageID
    );
  }
};
