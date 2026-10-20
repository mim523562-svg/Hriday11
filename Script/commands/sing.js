Install sing.js 
/**
 * ╔══════════════════════════════════════════╗
 * ║          🎵 HRIDOY SING V2 🎵            ║
 * ║       YouTube Song Downloader             ║
 * ║       💠 HRIDOY HASAN SHANTO 💠           ║
 * ╚══════════════════════════════════════════╝
 *
 * System: Mirai Legacy
 * Command: sing / song
 */

const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
const SONG_API_BASE = "https://eryxenx.agi.bd/api/song";

module.exports.config = {
  name: "sing",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "YouTube থেকে গান ডাউনলোড করে পাঠায়",
  commandCategory: "media",
  usages: "sing <গানের নাম>",
  cooldowns: 5,
  dependencies: {
    axios: "",
    "yt-search": "",
    "fs-extra": ""
  },
  aliases: ["song"]
};

function react(api, event, emoji) {
  try {
    api.setMessageReaction(
      emoji,
      event.messageID,
      () => {},
      true
    );
  } catch (_) {}
}

function getError(err) {
  const raw = err.response && err.response.data;

  if (raw && typeof raw === "object" && !Buffer.isBuffer(raw)) {
    return raw.error || raw.message || err.message;
  }

  return err.message || "অজানা সমস্যা";
}

async function getSongInfo(videoUrl) {
  const res = await axios.get(SONG_API_BASE, {
    params: { url: videoUrl },
    timeout: 60000
  });

  if (
    !res.data ||
    !res.data.success ||
    !res.data.downloadUrl
  ) {
    throw new Error(
      (res.data && res.data.error) ||
      "API থেকে ডাউনলোড লিংক পাওয়া যায়নি"
    );
  }

  return res.data;
}

async function downloadSong(url, filePath) {
  await fs.ensureDir(CACHE_DIR);

  const response = await axios.get(url, {
    responseType: "stream",
    timeout: 300000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const contentType = String(
    response.headers["content-type"] || ""
  ).toLowerCase();

  if (
    !contentType.includes("audio") &&
    !contentType.includes("video") &&
    !contentType.includes("octet-stream")
  ) {
    response.data.destroy();
    throw new Error(
      "API থেকে অডিও ফাইল পাওয়া যায়নি। Content-Type: " +
      contentType
    );
  }

  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    let finished = false;

    const fail = (err) => {
      if (finished) return;
      finished = true;
      writer.destroy();

      fs.remove(filePath).catch(() => {});
      reject(err);
    };

    response.data.on("error", fail);
    writer.on("error", fail);

    writer.on("finish", () => {
      if (finished) return;
      finished = true;
      resolve();
    });

    response.data.pipe(writer);
  });

  const stats = await fs.stat(filePath);

  if (stats.size < 1024) {
    await fs.remove(filePath);
    throw new Error("ডাউনলোড করা অডিও ফাইলটি অসম্পূর্ণ");
  }
}

module.exports.run = async function ({
  api,
  event,
  args
}) {
  const query = args.join(" ").trim();
  const { threadID, messageID } = event;

  if (!query) {
    return api.sendMessage(
      "🎵 | গানের নাম লিখুন!\n\n" +
      "উদাহরণ: sing Mann Mera\n" +
      "💠 HRIDOY HASAN SHANTO 💠",
      threadID,
      null,
      messageID
    );
  }

  react(api, event, "⏳");

  let filePath = null;

  try {
    await fs.ensureDir(CACHE_DIR);

    const search = await yts(query);
    const video = search.videos && search.videos[0];

    if (!video) {
      react(api, event, "❌");
      return api.sendMessage(
        "❌ | এই গানের কোনো ফলাফল পাওয়া যায়নি!",
        threadID,
        null,
        messageID
      );
    }

    const info = await getSongInfo(video.url);

    filePath = path.join(
      CACHE_DIR,
      `sing_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}.mp3`
    );

    await downloadSong(info.downloadUrl, filePath);

    const title = info.title || video.title;
    const duration = video.timestamp || "অজানা";

    await new Promise((resolve, reject) => {
      api.sendMessage(
        {
          body:
            "╭━━━〔 🎵 গান ডাউনলোড 🎵 〕━━━╮\n" +
            `🎶 নাম: ${title}\n` +
            `⏱️ সময়: ${duration}\n` +
            "╰━━━━━━━━━━━━━━━━━━━━╯\n" +
            "💠 HRIDOY HASAN SHANTO 💠",
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        (err, messageInfo) => {
          if (err) return reject(err);
          resolve(messageInfo);
        },
        messageID
      );
    });

    react(api, event, "✅");

  } catch (err) {
    console.error("[HRIDOY SING ERROR]", err);
    react(api, event, "❌");

    return api.sendMessage(
      "❌ | গান ডাউনলোড করা যায়নি!\n\n" +
      "কারণ: " + getError(err) + "\n\n" +
      "💠 HRIDOY HASAN SHANTO 💠",
      threadID,
      null,
      messageID
    );

  } finally {
    if (filePath) {
      try {
        await fs.remove(filePath);
      } catch (err) {
        console.error(
          "[HRIDOY SING CLEANUP]",
          err.message
        );
      }
    }
  }
};
