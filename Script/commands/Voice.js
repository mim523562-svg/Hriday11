
/**
 * ╔══════════════════════════════════════════════╗
 * ║       🎙️ HRIDOY TEXT VOICE V10              ║
 * ║       💠 HRIDOY HASAN SHANTO 💠             ║
 * ║       RANDOM VOICE + ON/OFF FIX             ║
 * ╚══════════════════════════════════════════════╝
 * System: Old Mirai
 * Format: module.exports = function ({ api, event })
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CREDIT = "💠 HRIDOY HASAN SHANTO 💠";
const CACHE_DIR = path.join(__dirname, "cache");
const STATE_FILE = path.join(__dirname, "voiceState.json");

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

module.exports.config = {
  name: "text_voice",
  version: "10.0.0",
  hasPermssion: 0,
  credits: CREDIT,
  description: "Random audio reply with persistent ON/OFF",
  commandCategory: "noprefix",
  usages: ".voice on/off/status",
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
    return fs.readJsonSync(STATE_FILE).enabled !== false;
  } catch (error) {
    console.error("[VOICE STATE]", error.message);
    return true;
  }
}

async function setState(enabled) {
  await fs.ensureDir(path.dirname(STATE_FILE));
  await fs.writeJson(
    STATE_FILE,
    { enabled: Boolean(enabled) },
    { spaces: 2 }
  );
}

function sendMessage(api, body, event) {
  return new Promise((resolve, reject) => {
    api.sendMessage(body, event.threadID, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    }, event.messageID);
  });
}

async function sendAudio(api, event, filePath) {
  return new Promise((resolve, reject) => {
    api.sendMessage({
      body: `🎙️ HRIDOY TEXT VOICE V10\n${CREDIT}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    }, event.messageID);
  });
}

const processed = new Set();

function claimMessage(id) {
  if (!id) return true;
  const key = String(id);
  if (processed.has(key)) return false;

  processed.add(key);

  // Prevent unlimited memory growth.
  if (processed.size > 3000) {
    const first = processed.values().next().value;
    processed.delete(first);
  }

  return true;
}

async function handle({ api, event }) {
  if (!api || !event || !event.threadID) return;

  const body = normalize(event.body);
  if (!body) return;

  // Prevent duplicate execution across old Mirai event hooks.
  if (!claimMessage(event.messageID)) return;

  // ON/OFF/STATUS commands must work even when voice is OFF.
  const match = body.match(/^[.!/]voice\s+(on|off|status)$/);

  if (match) {
    const action = match[1];

    try {
      if (action === "on") await setState(true);
      if (action === "off") await setState(false);

      const enabled = getState();

      const reply = action === "status"
        ? `🎙️ HRIDOY TEXT VOICE V10\n📊 Status: ${enabled ? "🟢 ON" : "🔴 OFF"}\n${CREDIT}`
        : `${enabled ? "🟢 Voice চালু হয়েছে!" : "🔴 Voice বন্ধ হয়েছে!"}\n${CREDIT}`;

      await sendMessage(api, reply, event);
    } catch (error) {
      console.error("[VOICE CONTROL]", error.message);
      await sendMessage(
        api,
        `❌ Voice setting save করা যায়নি!\n${CREDIT}`,
        event
      ).catch(() => {});
    }

    return;
  }

  // Voice list.
  if ([
    "voice list",
    "voicelist",
    "text voice",
    "textvoice",
    "ভয়েস লিস্ট",
    "ভয়েস লিস্ট",
    "🎤"
  ].includes(body)) {
    const list = Object.keys(textAudioMap).join("  ");

    return sendMessage(
      api,
      `🎙️ HRIDOY TEXT VOICE V10\n\n${list}\n\n.voice on\n.voice off\n.voice status\n\n${CREDIT}`,
      event
    ).catch(error => console.error("[VOICE LIST]", error.message));
  }

  if (!getState()) return;

  const urls = textAudioMap[body];
  if (!urls || !urls.length) return;

  let filePath;

  try {
    await fs.ensureDir(CACHE_DIR);

    const url = urls[Math.floor(Math.random() * urls.length)];
    const extension = /\.mp4(?:\?|$)/i.test(url) ? ".mp4" : ".mp3";
    const safeId = String(event.messageID || Date.now())
      .replace(/[^a-zA-Z0-9_-]/g, "");

    filePath = path.join(
      CACHE_DIR,
      `voice_${safeId}_${Date.now()}${extension}`
    );

    const response = await axios.get(url, {
      responseType: "stream",
      timeout: 30000,
      maxRedirects: 5
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.on("error", reject);
      writer.on("error", reject);
      writer.on("finish", resolve);
      response.data.pipe(writer);
    });

    await sendAudio(api, event, filePath);
  } catch (error) {
    console.error("[TEXT VOICE ERROR]", error.message);
  } finally {
    if (filePath) {
      setTimeout(() => {
        fs.remove(filePath).catch(() => {});
      }, 10000);
    }
  }
}

// Old Mirai event format.
module.exports = async function ({ api, event }) {
  return handle({ api, event });
};

// Command compatibility.
module.exports.run = async function ({ api, event, args }) {
  const body = event.body ||
    `.voice ${(Array.isArray(args) ? args : []).join(" ")}`;

  return handle({
    api,
    event: { ...event, body }
  });
};
