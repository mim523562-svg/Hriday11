
/**
 * ╔══════════════════════════════════════════════╗
 * ║          🎙️ HRIDOY TEXT VOICE V8            ║
 * ║        💠 HRIDOY HASAN SHANTO 💠            ║
 * ║     ALL-IN-ONE RANDOM VOICE + ON/OFF         ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
const STATE_FILE = path.join(__dirname, "voiceState.json");

// ================================================
// 🎛️ PERSISTENT VOICE SWITCH
// ================================================

function isVoiceEnabled() {
  try {
    if (!fs.existsSync(STATE_FILE)) return true;
    return fs.readJsonSync(STATE_FILE).enabled !== false;
  } catch {
    return true;
  }
}

async function setVoiceEnabled(enabled) {
  await fs.ensureDir(__dirname);
  await fs.writeJson(STATE_FILE, { enabled }, { spaces: 2 });
}

// ================================================
// 🎙️ TEXT / EMOJI VOICE MAP
// তোমার দেওয়া সব URL এখানে রাখা হয়েছে
// ================================================

const textAudioMap = {
  "🤖": ["https://files.catbox.moe/l0jhdq.mp3"],
  "🥱": [
    "https://files.catbox.moe/mofu8n.mp3",
    "https://files.catbox.moe/088yxs.mp3"
  ],
  "ভয়েস": ["https://files.catbox.moe/b973ms.mp4"],
  "🤏": ["https://files.catbox.moe/8w1wo5.mp3"],
  "এহ": ["https://files.catbox.moe/6tkyn2.mp3"],
  "ডিলেট": ["https://files.catbox.moe/kcemka.mp4"],
  "🤦‍♂️": ["https://files.catbox.moe/5rdtc6.mp3"],
  "mata beta": ["https://files.catbox.moe/5rdtc6.mp3"],
  "🫠": ["https://files.catbox.moe/dz7n65.mp3"],
  "সর বাল": ["https://files.catbox.moe/q84p1d.mp3"],
  "কেউ নাই": ["https://files.catbox.moe/3u6shs.mp3"],
  "good night": ["https://files.catbox.moe/i29m4q.mp3"],
  "গুড নাইট": ["https://files.catbox.moe/i29m4q.mp3"],
  "good morning": ["https://files.catbox.moe/8gzqx5.mp3"],
  "গুড মর্নিং": ["https://files.catbox.moe/8gzqx5.mp3"],
  "i love you": ["https://files.catbox.moe/y3fk8i.mp3"],
  "love you": ["https://files.catbox.moe/y3fk8i.mp3"],
  "@everyone": ["https://files.catbox.moe/3u6shs.mp3"],
  "ভুদা": ["https://files.catbox.moe/gnyx0p.mp3"],
  "by": ["https://files.catbox.moe/fdqh2m.mp3"],
  "বাই": ["https://files.catbox.moe/fdqh2m.mp3"],
  "বায়": ["https://files.catbox.moe/fdqh2m.mp3"],
  "🫵😡": ["https://files.catbox.moe/yuonxq.mp3"],
  "🤨": ["https://files.catbox.moe/995anc.mp3"],
  "dirim": ["https://files.catbox.moe/1rk48q.mp4"],
  "চুদি": ["https://files.catbox.moe/0ykb7f.mp3"],
  "☺️": ["https://files.catbox.moe/p2mi4u.mp3"],
  "😊": ["https://files.catbox.moe/p2mi4u.mp3"],
  "🌚": ["https://files.catbox.moe/ze3wu1.mp3"],
  "🌝": ["https://files.catbox.moe/ze3wu1.mp3"],
  "🐸": ["https://files.catbox.moe/9u1857.mp3"],
  "👀": ["https://files.catbox.moe/372kl0.mp3"],
  "🖕": ["https://files.catbox.moe/372kl0.mp3"],
  "😁": ["https://files.catbox.moe/ef6me4.mp3"],
  "🤣": ["https://files.catbox.moe/ipihl6.mp3"],
  "😆": ["https://files.catbox.moe/r4unub.mp3"],
  "😑": ["https://files.catbox.moe/z1evci.mp3"],
  "😅": ["https://files.catbox.moe/7hvdo6.mp3"],
  "😍": ["https://files.catbox.moe/r13v24.mp3"],
  "😒": ["https://files.catbox.moe/ww8yts.mp3"],
  "💋": ["https://files.catbox.moe/hd0zfr.mp3"],
  "😘": ["https://files.catbox.moe/hd0zfr.mp3"],
  "😡": ["https://files.catbox.moe/b5y405.mp3"],
  "🤬": ["https://files.catbox.moe/b5y405.mp3"],
  "😩": ["https://files.catbox.moe/vb01zl.mp3"],
  "😭": ["https://files.catbox.moe/d9w35v.mp3"],
  "🙂": ["https://files.catbox.moe/flp9ed.mp3"],
  "🙏": ["https://files.catbox.moe/2aw07b.mp3"],
  "😂": ["https://files.catbox.moe/vknlt2.mp3"],
  "🤭": ["https://files.catbox.moe/5s606f.mp3"],
  "🥰": ["https://files.catbox.moe/1ojauw.mp3"],
  "🥵": ["https://files.catbox.moe/c0odmp.mp3"],
  "🥺": ["https://files.catbox.moe/458umf.mp3"],
  "🥹": ["https://files.catbox.moe/cj6ny7.mp3"],
  "🫶": ["https://files.catbox.moe/hyo82t.mp3"],
  "🫣": ["https://files.catbox.moe/2qjfwl.mp3"],
  "🍼": ["https://files.catbox.moe/gvrvkh.mp3"],
  "👍": ["https://files.catbox.moe/mkvysb.mp3"]
};

// ================================================
// 🛡️ DUPLICATE PROTECTION
// ================================================

const processedMessages = new Set();

function alreadyProcessed(id) {
  if (!id) return false;

  const key = String(id);
  if (processedMessages.has(key)) return true;

  processedMessages.add(key);

  setTimeout(() => processedMessages.delete(key), 30000);

  if (processedMessages.size > 5000) {
    const oldest = processedMessages.values().next().value;
    processedMessages.delete(oldest);
  }

  return false;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function getRandomVoice(key) {
  const list = textAudioMap[key];
  if (!Array.isArray(list) || list.length === 0) return null;

  return list[Math.floor(Math.random() * list.length)];
}

// ================================================
// 📋 HELP MENU
// ================================================

const voiceList = `
╔══════════════════════════════╗
     🎙️ HRIDOY TEXT VOICE V8
╚══════════════════════════════╝

🎛️ VOICE CONTROL
🟢 .voice on
🔴 .voice off
📊 .voice status

🎙️ TEXT TRIGGERS
🤖 🥱 🤏 🤦‍♂️ 🫠 🤨
ভয়েস | এহ | ডিলেট
mata beta | সর বাল | কেউ নাই
good night | গুড নাইট
good morning | গুড মর্নিং
i love you | love you
@everyone | ভুদা
by | বাই | বায়
dirim | চুদি

😄 EMOJI VOICE
☺️ 😊 🌚 🌝 🐸 👀 🖕
😁 🤣 😆 😑 😅 😍 😒
💋 😘 😡 🤬 😩 😭 🙂
🙏 😂 🤭 🥰 🥵 🥺
🥹 🫶 🫣 🍼 👍

💠 ADMIN: HRIDOY HASAN SHANTO
🎲 RANDOM VOICE SYSTEM
🛡️ ONE MESSAGE = ONE PROCESS
`;

// ================================================
// ⚙️ MODULE CONFIG
// ================================================

module.exports.config = {
  name: "text_voice",
  version: "8.0.0",
  hasPermssion: 0,
  role: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  author: "HRIDOY HASAN SHANTO",
  description: "All-in-One Text/Emoji Voice ON/OFF",
  shortDescription: "Text Voice Control",
  longDescription: "Random voice with persistent ON/OFF switch",
  commandCategory: "noprefix",
  category: "noprefix",
  usages: ".voice on/off/status অথবা Text/Emoji",
  cooldowns: 2,
  countDown: 2
};

// ================================================
// 🎙️ CORE HANDLER
// ================================================

async function processVoice(api, event) {
  if (!api || !event || !event.threadID) return;

  const threadID = event.threadID;
  const messageID = event.messageID;
  const key = normalize(event.body);

  if (!key) return;

  // Voice control commands
  if (key === ".voice on" || key === ".voice off" || key === ".voice status") {
    const action = key.split(/\s+/)[1];

    try {
      if (action === "on") await setVoiceEnabled(true);
      if (action === "off") await setVoiceEnabled(false);

      const enabled = isVoiceEnabled();

      return api.sendMessage(
        enabled
          ? "🟢 সব অটো ভয়েস চালু আছে!\n💠 HRIDOY HASAN SHANTO"
          : "🔴 সব অটো ভয়েস বন্ধ আছে!\n💠 HRIDOY HASAN SHANTO",
        threadID,
        messageID
      );
    } catch (error) {
      console.error("[VOICE CONTROL]", error.message);
      return api.sendMessage(
        "❌ Voice setting save করা যায়নি।",
        threadID,
        messageID
      );
    }
  }

  if (["voice list", "voicelist", "text voice", "textvoice",
       "ভয়েস লিস্ট", "ভয়েস লিস্ট", "ভয়েস লিস্ট দাও", "🎤",
       "command list"].includes(key)) {
    if (alreadyProcessed(messageID)) return;
    return api.sendMessage(voiceList, threadID, messageID);
  }

  // Do not play voice while disabled
  if (!isVoiceEnabled()) return;

  if (alreadyProcessed(messageID)) return;

  const audioUrl = getRandomVoice(key);
  if (!audioUrl) return;

  let filePath;

  try {
    await fs.ensureDir(CACHE_DIR);

    const extension = /\.mp4(?:$|\?)/i.test(audioUrl) ? ".mp4" : ".mp3";
    const safeID = String(messageID || Date.now()).replace(/[^a-zA-Z0-9_-]/g, "");

    filePath = path.join(CACHE_DIR, `voice_${safeID}${extension}`);

    const response = await axios.get(audioUrl, {
      responseType: "stream",
      timeout: 30000,
      maxRedirects: 5,
      validateStatus: status => status >= 200 && status < 300
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.on("error", reject);
      writer.on("error", reject);
      writer.on("finish", resolve);
      response.data.pipe(writer);
    });

    await new Promise((resolve, reject) => {
      let settled = false;

      const done = error => {
        if (settled) return;
        settled = true;
        error ? reject(error) : resolve();
      };

      try {
        api.sendMessage(
          { attachment: fs.createReadStream(filePath) },
          threadID,
          done,
          messageID
        );
      } catch (error) {
        done(error);
      }
    });
  } catch (error) {
    console.error("[TEXT_VOICE ERROR]", error.message);
  } finally {
    if (filePath) {
      setTimeout(() => fs.remove(filePath).catch(() => {}), 3000);
    }
  }
}

// ================================================
// 🐐 GOATBOT HANDLERS
// ================================================

module.exports.onStart = async function ({ api, event }) {
  return processVoice(api, event);
};

module.exports.onChat = async function ({ api, event }) {
  return processVoice(api, event);
};

module.exports.handleEvent = async function ({ api, event }) {
  return processVoice(api, event);
};

// ================================================
// 🤖 MIRAI COMPATIBILITY
// ================================================

module.exports.run = async function ({
  api,
  event,
  args,
  threadID
}) {
  const currentEvent = event || {
    threadID,
    messageID: null,
    body: Array.isArray(args) ? args.join(" ") : String(args || "")
  };

  return processVoice(api, currentEvent);
};
