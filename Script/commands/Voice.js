/**
 * ╔══════════════════════════════════════════════╗
 * ║       🎙️ HRIDOY TEXT VOICE V11              ║
 * ║       💠 HRIDOY HASAN SHANTO 💠             ║
 * ║       OLD MIRAI COMPATIBILITY                ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CREDIT = "💠 HRIDOY HASAN SHANTO 💠";
const CACHE_DIR = path.join(__dirname, "cache");
const STATE_FILE = path.join(__dirname, "voiceState.json");

const AUDIO = {
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

module.exports.config = {
  name: "text_voice",
  version: "11.0.0",
  hasPermssion: 0,
  credits: CREDIT,
  description: "Automatic audio reply and voice controls",
  commandCategory: "utility",
  usages: ".voice on/off/status/list",
  cooldowns: 1
};

function normalize(value) {
  return String(value || "")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function getState() {
  try {
    if (!fs.existsSync(STATE_FILE)) return true;

    const state = fs.readJsonSync(STATE_FILE);
    return state.enabled !== false;
  } catch (error) {
    console.error("[HRIDOY VOICE STATE]", error.message);
    return true;
  }
}

async function setState(enabled) {
  await fs.ensureDir(path.dirname(STATE_FILE));

  const tempFile = STATE_FILE + ".tmp";
  await fs.writeJson(tempFile, { enabled }, { spaces: 2 });
  await fs.move(tempFile, STATE_FILE, { overwrite: true });
}

function sendText(api, event, body) {
  return new Promise((resolve, reject) => {
    api.sendMessage(
      body,
      event.threadID,
      (error, info) => error ? reject(error) : resolve(info),
      event.messageID
    );
  });
}

function findAudio(body) {
  const key = Object.keys(AUDIO).find(
    item => normalize(item) === body
  );

  return key ? AUDIO[key] : null;
}

async function sendVoice(api, event, filePath) {
  return new Promise((resolve, reject) => {
    api.sendMessage(
      {
        body: `🎙️ HRIDOY TEXT VOICE V11\n${CREDIT}`,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      (error, info) => error ? reject(error) : resolve(info),
      event.messageID
    );
  });
}

const processing = new Set();

async function handle({ api, event }) {
  if (!api || !event || !event.threadID) return;

  const body = normalize(event.body);
  if (!body) return;

  const messageID = event.messageID
    ? String(event.messageID)
    : null;

  if (messageID && processing.has(messageID)) return;

  if (messageID) processing.add(messageID);

  try {
    // ON / OFF / STATUS / LIST
    const match = body.match(/^[.!/]voice(?:\s+(on|off|status|list))?$/);

    if (match) {
      const action = match[1] || "status";

      if (action === "on") {
        await setState(true);
        return await sendText(
          api, event,
          `🟢 TEXT VOICE চালু হয়েছে!\n🎙️ এখন অডিও রিপ্লাই চলবে।\n${CREDIT}`
        );
      }

      if (action === "off") {
        await setState(false);
        return await sendText(
          api, event,
          `🔴 TEXT VOICE বন্ধ হয়েছে!\n🎙️ অটো অডিও রিপ্লাই বন্ধ।\n${CREDIT}`
        );
      }

      if (action === "status") {
        return await sendText(
          api, event,
          `🎙️ HRIDOY TEXT VOICE V11\n` +
          `📊 Status: ${getState() ? "🟢 ON" : "🔴 OFF"}\n\n` +
          `.voice on\n.voice off\n.voice status\n.voice list\n\n${CREDIT}`
        );
      }

      if (action === "list") {
        return await sendText(
          api, event,
          `🎙️ TEXT VOICE LIST\n\n${Object.keys(AUDIO).join("  ")}\n\n${CREDIT}`
        );
      }
    }

    // List shortcuts
    if ([
      "voice list", "voicelist", "text voice",
      "textvoice", "ভয়েস লিস্ট", "ভয়েস লিস্ট", "🎤"
    ].includes(body)) {
      return await sendText(
        api, event,
        `🎙️ TEXT VOICE LIST\n\n${Object.keys(AUDIO).join("  ")}\n\n${CREDIT}`
      );
    }

    if (!getState()) return;

    const urls = findAudio(body);
    if (!urls || !urls.length) return;

    await fs.ensureDir(CACHE_DIR);

    const url = urls[Math.floor(Math.random() * urls.length)];
    const extension = /\.mp4(?:\?|$)/i.test(url) ? ".mp4" : ".mp3";
    const filePath = path.join(
      CACHE_DIR,
      `voice_${Date.now()}_${Math.random().toString(36).slice(2)}${extension}`
    );

    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 30000,
        maxRedirects: 5,
        validateStatus: status => status >= 200 && status < 300
      });

      if (!response.data || response.data.length < 100) {
        throw new Error("Audio file is empty or invalid");
      }

      await fs.writeFile(filePath, response.data);
      await sendVoice(api, event, filePath);
    } finally {
      await fs.remove(filePath).catch(() => {});
    }
  } catch (error) {
    console.error("[HRIDOY TEXT VOICE V11]", error.stack || error.message);
  } finally {
    if (messageID) processing.delete(messageID);
  }
}

// Old Mirai event compatibility
module.exports = async function ({ api, event }) {
  return handle({ api, event });
};

// Command compatibility
module.exports.run = async function ({ api, event, args }) {
  const commandText = event.body ||
    `.voice ${(Array.isArray(args) ? args : []).join(" ")}`;

  return handle({
    api,
    event: { ...event, body: commandText }
  });
};
