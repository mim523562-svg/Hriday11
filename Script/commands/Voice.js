/**
 * ╔══════════════════════════════════════════════╗
 * ║              🎙️ TEXT VOICE BOT              ║
 * ║        💠 HRIDOY HASAN SHANTO 💠            ║
 * ║       MIRAI + GOATBOT COMPATIBLE             ║
 * ║          RANDOM ONE-OF VOICE SYSTEM          ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ═══════════════════════════════════════════════
// 🎙️ TEXT / EMOJI → VOICE MAP
// ═══════════════════════════════════════════════

const textAudioMap = {

  "🤖": [
    "https://files.catbox.moe/l0jhdq.mp3"
  ],

  "🥱": [
    "https://files.catbox.moe/mofu8n.mp3"
  ],

  "ভয়েস": [
    "https://files.catbox.moe/b973ms.mp4"
  ],

  "🤏": [
    "https://files.catbox.moe/8w1wo5.mp3"
  ],

  "এহ": [
    "https://files.catbox.moe/6tkyn2.mp3"
  ],

  "ডিলেট": [
    "https://files.catbox.moe/kcemka.mp4"
  ],

  "🤦‍♂️": [
    "https://files.catbox.moe/5rdtc6.mp3"
  ],

  "mata beta": [
    "https://files.catbox.moe/5rdtc6.mp3"
  ],

  "🫠": [
    "https://files.catbox.moe/dz7n65.mp3"
  ],

  "সর বাল": [
    "https://files.catbox.moe/q84p1d.mp3"
  ],

  "কেউ নাই": [
    "https://files.catbox.moe/3u6shs.mp3"
  ],

  "good night": [
    "https://files.catbox.moe/i29m4q.mp3"
  ],

  "গুড নাইট": [
    "https://files.catbox.moe/i29m4q.mp3"
  ],

  "good morning": [
    "https://files.catbox.moe/8gzqx5.mp3"
  ],

  "গুড মর্নিং": [
    "https://files.catbox.moe/8gzqx5.mp3"
  ],

  "i love you": [
    "https://files.catbox.moe/y3fk8i.mp3"
  ],

  "love you": [
    "https://files.catbox.moe/y3fk8i.mp3"
  ],

  "@everyone": [
    "https://files.catbox.moe/3u6shs.mp3"
  ],

  "ভুদা": [
    "https://files.catbox.moe/gnyx0p.mp3"
  ],

  "by": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ],

  "বাই": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ],

  "বায়": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ],

  "🫵😡": [
    "https://files.catbox.moe/yuonxq.mp3"
  ],

  "🤨": [
    "https://files.catbox.moe/995anc.mp3"
  ],

  "dirim": [
    "https://files.catbox.moe/1rk48q.mp4"
  ],

  "চুদি": [
    "https://files.catbox.moe/0ykb7f.mp3"
  ],

  // ═══════════════════════════════════════════
  // 😄 NEW EMOJI VOICE
  // ═══════════════════════════════════════════

  "☺️": [
    "https://files.catbox.moe/p2mi4u.mp3"
  ],

  "😊": [
    "https://files.catbox.moe/p2mi4u.mp3"
  ],

  "🌚": [
    "https://files.catbox.moe/ze3wu1.mp3"
  ],

  "🌝": [
    "https://files.catbox.moe/ze3wu1.mp3"
  ],

  "🐸": [
    "https://files.catbox.moe/9u1857.mp3"
  ],

  "👀": [
    "https://files.catbox.moe/372kl0.mp3"
  ],

  "🖕": [
    "https://files.catbox.moe/372kl0.mp3"
  ],

  "😁": [
    "https://files.catbox.moe/ef6me4.mp3"
  ],

  "🤣": [
    "https://files.catbox.moe/ipihl6.mp3"
  ],

  "😆": [
    "https://files.catbox.moe/r4unub.mp3"
  ],

  "😑": [
    "https://files.catbox.moe/z1evci.mp3"
  ],

  "😅": [
    "https://files.catbox.moe/7hvdo6.mp3"
  ],

  "😍": [
    "https://files.catbox.moe/r13v24.mp3"
  ],

  "😒": [
    "https://files.catbox.moe/ww8yts.mp3"
  ],

  "💋": [
    "https://files.catbox.moe/hd0zfr.mp3"
  ],

  "😘": [
    "https://files.catbox.moe/hd0zfr.mp3"
  ],

  "😡": [
    "https://files.catbox.moe/b5y405.mp3"
  ],

  "🤬": [
    "https://files.catbox.moe/b5y405.mp3"
  ],

  "😩": [
    "https://files.catbox.moe/vb01zl.mp3"
  ],

  "😭": [
    "https://files.catbox.moe/d9w35v.mp3"
  ],

  "🙂": [
    "https://files.catbox.moe/flp9ed.mp3"
  ],

  "🙏": [
    "https://files.catbox.moe/2aw07b.mp3"
  ],

  "😂": [
    "https://files.catbox.moe/vknlt2.mp3"
  ],

  "🤭": [
    "https://files.catbox.moe/5s606f.mp3"
  ],

  "🥰": [
    "https://files.catbox.moe/1ojauw.mp3"
  ],

  "🥱": [
    "https://files.catbox.moe/088yxs.mp3"
  ],

  "🥵": [
    "https://files.catbox.moe/c0odmp.mp3"
  ],

  "🥺": [
    "https://files.catbox.moe/458umf.mp3"
  ],

  "🥹": [
    "https://files.catbox.moe/cj6ny7.mp3"
  ],

  "🫶": [
    "https://files.catbox.moe/hyo82t.mp3"
  ],

  "🫣": [
    "https://files.catbox.moe/2qjfwl.mp3"
  ],

  "🍼": [
    "https://files.catbox.moe/gvrvkh.mp3"
  ],

  "👍": [
    "https://files.catbox.moe/mkvysb.mp3"
  ]
};

// ═══════════════════════════════════════════════
// 🛡️ DUPLICATE PROTECTION
// ═══════════════════════════════════════════════

const processedMessages = new Set();

function alreadyProcessed(id) {

  if (!id) return false;

  if (processedMessages.has(id)) {
    return true;
  }

  processedMessages.add(id);

  setTimeout(() => {
    processedMessages.delete(id);
  }, 30000);

  return false;
}

// ═══════════════════════════════════════════════
// 🎲 RANDOM VOICE
// ═══════════════════════════════════════════════

function getRandomVoice(key) {

  const list = textAudioMap[key];

  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }

  return list[
    Math.floor(Math.random() * list.length)
  ];
}

// ═══════════════════════════════════════════════
// 📋 VOICE LIST
// ═══════════════════════════════════════════════

const voiceList = `
╔═══『 🎙️ TEXT VOICE 』═══╗
      🩸 AUTO VOICE LIST
╚════════════════════════╝

🎙️ TEXT TRIGGERS

🎵 গান
😴 ঘুমা
🎙️ ভয়েস
😂 নাটেক
😶 এহ
🗑️ ডিলেট
🧠 matha betha
🧠 mata beta
😂 মিম
🤣 সর বাল
🥺 কেউ নাই

🌙 good night
🌙 গুড নাইট
🌅 good morning
🌅 গুড মর্নিং

❤️ i love you
❤️ love you

📢 @everyone
😈 ভুদা

👋 by
👋 বাই
👋 বায়

🫵😡
🎵 gana
🎙️ dirim
🔊 চুদি

━━━━━━━━━━━━━━━━━━━━━━

😄 EMOJI VOICE

☺️ 😊 🌚 🌝
🐸 👀 🖕 😁
🤣 😆 😑 😅
😍 😒 💋 😘
😡 🤬 😩 😭
🙂 🙏 😂 🤭
🥰 🥱 🥵 🥺
🥹 🫶 🫣 🍼
👍

━━━━━━━━━━━━━━━━━━━━━━

🎲 Multiple URL থাকলে
প্রতিবার Random Voice

🛡️ Same Message ID
শুধু একবার Process হবে

💠 BOT : TEXT VOICE
👑 ADMIN : HRIDOY HASAN SHANTO
🎙️ SYSTEM : AUTO VOICE

━━━━━━━━━━━━━━━━━━━━━━
`;

// ═══════════════════════════════════════════════
// ⚙️ CONFIG
// ═══════════════════════════════════════════════

module.exports.config = {

  name: "text_voice",

  version: "5.0.0",

  hasPermssion: 0,

  role: 0,

  credits: "💠 HRIDOY HASAN SHANTO 💠",

  author: "HRIDOY HASAN SHANTO",

  description:
    "Text এবং Emoji দিলে নির্দিষ্ট voice play করবে",

  shortDescription:
    "Text / Emoji Auto Voice",

  longDescription:
    "Text ও Emoji trigger অনুযায়ী voice পাঠায়",

  commandCategory: "noprefix",

  category: "noprefix",

  usages: "Text / Emoji",

  cooldowns: 2,

  countDown: 2
};

// ═══════════════════════════════════════════════
// 🎙️ CORE HANDLER
// ═══════════════════════════════════════════════

async function processVoice(api, event) {

  let filePath = null;

  try {

    if (!event || !api) return;

    const threadID = event.threadID;
    const messageID = event.messageID;
    const body = event.body;

    if (!threadID || !body) {
      return;
    }

    // 🛡️ SAME MESSAGE ID = ONLY ONE TIME
    if (alreadyProcessed(messageID)) {
      return;
    }

    const key = String(body)
      .trim()
      .toLowerCase();

    // ═══════════════════════════════════════════
    // 📋 VOICE LIST
    // ═══════════════════════════════════════════

    const listTriggers = [
      "voice list",
      "voicelist",
      "text voice",
      "textvoice",
      "ভয়েস লিস্ট",
      "ভয়েস লিস্ট",
      "ভয়েস লিস্ট দাও",
      "🎤",
      "command list"
    ];

    if (listTriggers.includes(key)) {

      return api.sendMessage(
        voiceList,
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════════
    // 🎲 SELECT VOICE
    // ═══════════════════════════════════════════

    const audioUrl = getRandomVoice(key);

    if (!audioUrl) {
      return;
    }

    // ═══════════════════════════════════════════
    // 📁 CACHE DIRECTORY
    // ═══════════════════════════════════════════

    const cacheDir = path.join(
      __dirname,
      "cache"
    );

    await fs.ensureDir(cacheDir);

    const safeKey = encodeURIComponent(key)
      .replace(/%/g, "_");

    const safeMessageID = String(
      messageID || Date.now()
    ).replace(
      /[^a-zA-Z0-9_-]/g,
      ""
    );

    filePath = path.join(
      cacheDir,
      `${safeKey}_${safeMessageID}.mp3`
    );

    // ═══════════════════════════════════════════
    // ⬇️ DOWNLOAD VOICE
    // ═══════════════════════════════════════════

    const response = await axios({

      method: "GET",

      url: audioUrl,

      responseType: "stream",

      timeout: 30000,

      maxRedirects: 5,

      validateStatus: (status) =>
        status >= 200 && status < 400

    });

    const writer =
      fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {

      writer.on("finish", resolve);

      writer.on("error", reject);

      response.data.on("error", reject);

    });

    // ═══════════════════════════════════════════
    // 🎙️ SEND VOICE
    // ═══════════════════════════════════════════

    await new Promise((resolve, reject) => {

      let finished = false;

      const done = (err) => {

        if (finished) return;

        finished = true;

        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };

      api.sendMessage(
        {
          attachment:
            fs.createReadStream(filePath)
        },
        threadID,
        done,
        messageID
      );

    });

    // ═══════════════════════════════════════════
    // 🗑️ CLEAN CACHE
    // ═══════════════════════════════════════════

    setTimeout(() => {

      if (
        filePath &&
        fs.existsSync(filePath)
      ) {

        fs.unlink(
          filePath,
          () => {}
        );

      }

    }, 1500);

  } catch (error) {

    console.error(
      "[TEXT_VOICE ERROR]",
      error.message
    );

    // Cleanup
    try {

      if (
        filePath &&
        fs.existsSync(filePath)
      ) {

        fs.unlink(
          filePath,
          () => {}
        );

      }

    } catch (_) {}

  }
}

// ═══════════════════════════════════════════════
// 🐐 GOATBOT FORMAT
// ═══════════════════════════════════════════════

module.exports.onStart = async function ({
  api,
  event
}) {

  return processVoice(
    api,
    event
  );

};

// ═══════════════════════════════════════════════
// 🐐 GOATBOT EVENT FORMAT
// ═══════════════════════════════════════════════

module.exports.onChat = async function ({
  api,
  event
}) {

  return processVoice(
    api,
    event
  );

};

// ═══════════════════════════════════════════════
// 🐐 LEGACY EVENT SUPPORT
// ═══════════════════════════════════════════════

module.exports.handleEvent = async function ({
  api,
  event
}) {

  return processVoice(
    api,
    event
  );

};

// ═══════════════════════════════════════════════
// 🤖 MIRAI FORMAT
// ═══════════════════════════════════════════════

module.exports.run = async function ({
  api,
  event,
  message,
  args,
  threadID,
  senderID
}) {

  const currentEvent = event || {
    threadID,
    senderID,
    messageID: null,
    body: Array.isArray(args)
      ? args.join(" ")
      : String(args || "")
  };

  return processVoice(
    api,
    currentEvent
  );

};
