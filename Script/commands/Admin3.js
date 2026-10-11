const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const INDEX_FILE = path.join(CACHE_DIR, "videoIndex.json");

// 🎬 NEW VIDEO LIST
const videoList = [
  {
    url: "https://files.catbox.moe/qra2vw.mp4",
    file: "video1.mp4"
  },
  {
    url: "https://files.catbox.moe/qhgrnw.mp4",
    file: "video2.mp4"
  },
  {
    url: "https://files.catbox.moe/lph6fv.mp4",
    file: "video3.mp4"
  },
  {
    url: "https://files.catbox.moe/tcru5m.mp4",
    file: "video4.mp4"
  },
  {
    url: "https://files.catbox.moe/jvgscs.mp4",
    file: "video5.mp4"
  }
];

// 👑 ADMIN CONFIG
const ADMIN_UID = "61593296285457";
const ADMIN_NAME = "হৃদয় হাসান শান্ত";

// 🔎 ADMIN TRIGGERS
const triggers = [
  "@Šħẫňto Hřiȡẫy Ħẫššẫň",
  "hriday hassan shanto",
  "হৃদয় হাসান শান্ত",
  "হৃদয়",
  "হৃদয় ভাই",
  "boss hriday",
  "রাব্বি ভাই",
  "বট অ্যাডমিন কে"
];

// 💬 MENTION CAPTIONS
const captions = [
  "🇲🇾 হৃদয় হাসান শান্তকে বেশি মেনশন দিও না! 😹💔",
  "🥀 হৃদয় হাসান শান্ত অনলাইনে আছে, কিন্তু ভাগ্য এখনো অফলাইনে! 🤧",
  "😎 বস এখন বিজি, মেনশন করলে পরে রিপ্লাই দিবে! 📩😂",
  "💔 এত মেনশন কেন? বসের ইনবক্সে আজও শান্তি নাই! 😹",
  "🤭 বসকে মেনশন করছো, এখন বলো কী দরকার! 😂",
  "🇲🇾 হৃদয় হাসান শান্ত কাজে ব্যস্ত, কিন্তু মেনশন দেখলে হাজির! 😎",
  "🔥 বসকে মেনশন করলে জরিমানা নেই, তবে একটা হাসি দিতে হবে! 😹",
  "🫂 সিঙ্গেল লাইফ চলছে, তাই বেশি ডিস্টার্ব না করাই ভালো! 😂",
  "🥺 মেনশন পেলেই বসের পুরনো স্মৃতি মনে পড়ে যায়! 💔",
  "😹 হৃদয় হাসান শান্ত হাজির! এখন বলেন, কী দরকার!",
  "👀 এত সুন্দর করে মেনশন করলা, এখন বসের নজরেও পড়লা! 😎",
  "😂 মেনশন করতে করতে বসের নাম মুখস্থ হয়ে গেছে নাকি?",
  "🔥 একবার মেনশন করলেই হাজির — হৃদয় হাসান শান্ত! 👑",
  "😹 মেনশন দেখেই বুঝলাম, বসকে ছাড়া আপনাদের আড্ডা জমে না!",
  "🥀 হৃদয় হাসান শান্তকে মেনশন করা হয়েছে, এখন অপেক্ষা করুন বসের আগমনের! 😎"
];

// 📥 DOWNLOAD VIDEO
async function downloadVideo(video) {
  const filePath = path.join(CACHE_DIR, video.file);

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  try {
    console.log(`📥 Downloading: ${video.file}`);

    const response = await axios({
      method: "GET",
      url: video.url,
      responseType: "stream",
      timeout: 60000
    });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
      response.data.on("error", reject);
    });

    console.log(`✅ Downloaded: ${video.file}`);

    return filePath;

  } catch (error) {
    console.log(`❌ Download failed: ${video.file}`);
    console.log(error.message);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}
    }

    return null;
  }
}

// 🚀 PRELOAD ALL VIDEOS
async function preloadVideos() {
  console.log("📥 Admin3 video preload started...");

  for (const video of videoList) {
    await downloadVideo(video);
  }

  console.log("✅ Admin3 video preload completed.");
}

preloadVideos();

// ⚙️ COMMAND CONFIG
module.exports.config = {
  name: "admin3",
  version: "3.1.0",
  hasPermssion: 0,
  credits: ADMIN_NAME,
  description: "Admin mention video reply",
  commandCategory: "system",
  usages: "",
  cooldowns: 1
};

// 📌 MIRAI EVENT
module.exports.handleEvent = async function ({ api, event }) {
  try {
    const senderID = String(event.senderID || "");

    if (!senderID) return;

    // 👑 Admin নিজে লিখলে reply করবে না
    if (senderID === ADMIN_UID) return;

    const body = String(event.body || "").trim();

    if (!body) return;

    const text = body.toLowerCase();

    // 👤 Mention check
    let mentionFound = false;

    if (event.mentions) {
      const mentionedIDs = Object.keys(event.mentions)
        .map(id => String(id));

      if (mentionedIDs.includes(ADMIN_UID)) {
        mentionFound = true;
      }
    }

    // 🔎 Keyword check
    const keywordFound = triggers.some(trigger =>
      text.includes(trigger.toLowerCase())
    );

    // ❌ Trigger না থাকলে কিছু করবে না
    if (!mentionFound && !keywordFound) return;

    // 💬 Random mention caption
    const caption =
      captions[Math.floor(Math.random() * captions.length)];

    const styledCaption = `
╭━━━━━━━━━━━━━━━━━━╮
      👑 𝗔𝗗𝗠𝗜𝗡 𝗠𝗘𝗡𝗧𝗜𝗢𝗡
╰━━━━━━━━━━━━━━━━━━╯

『 ${caption} 』

╭━━━━━━━━━━━━━━━━━━╮
      🇲🇾 𝗛𝗥𝗜𝗗𝗔𝗬
╰━━━━━━━━━━━━━━━━━━╯
`;

    // 🎬 Read current video index
    let currentIndex = 0;

    if (fs.existsSync(INDEX_FILE)) {
      try {
        const data = JSON.parse(
          fs.readFileSync(INDEX_FILE, "utf8")
        );

        if (
          typeof data.index === "number" &&
          data.index >= 0 &&
          data.index < videoList.length
        ) {
          currentIndex = data.index;
        }

      } catch (e) {
        currentIndex = 0;
      }
    }

    const selectedVideo = videoList[currentIndex];

    // 🔄 Save next video index
    const nextIndex =
      (currentIndex + 1) % videoList.length;

    fs.writeFileSync(
      INDEX_FILE,
      JSON.stringify(
        { index: nextIndex },
        null,
        2
      )
    );

    // 📥 Download selected video
    const videoPath = await downloadVideo(selectedVideo);

    // ❌ Video unavailable হলে text reply
    if (!videoPath || !fs.existsSync(videoPath)) {
      return api.sendMessage(
        styledCaption,
        event.threadID,
        event.messageID
      );
    }

    // 📤 Send video
    return api.sendMessage(
      {
        body: styledCaption,
        attachment: fs.createReadStream(videoPath)
      },
      event.threadID,
      event.messageID
    );

  } catch (error) {

    console.log("❌ Admin3 Error:", error);

    try {
      return api.sendMessage(
        "❌ Admin mention reply দিতে সমস্যা হয়েছে!",
        event.threadID,
        event.messageID
      );
    } catch (e) {}
  }
};

// 📌 COMMAND SUPPORT
module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "✅ Admin3 চালু আছে!\n\n👑 Admin mention করলে নতুন ভিডিও + mention caption রিপ্লাই করবে।",
    event.threadID,
    event.messageID
  );
};
