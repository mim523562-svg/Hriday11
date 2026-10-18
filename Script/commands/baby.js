
/**
 * ╔══════════════════════════════════════╗
 * ║          💠 BABY AI V10 💠           ║
 * ║      Stylish Auto Reply System       ║
 * ║       HRIDOY HASAN SHANTO             ║
 * ╚══════════════════════════════════════╝
 *
 * System: Mirai Legacy
 * Format: module.exports = function ({ api, event })
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const OWNER = "💠 HRIDOY HASAN SHANTO 💠";
const FACEBOOK_ID = "1F7P4o3zfY";
const WHATSAPP = "+601116710390";
const API_URL = "https://noobs-api.top/dipto/baby";

const DATA_DIR = path.join(__dirname, "baby_data");
const OFF_FILE = path.join(DATA_DIR, "disabled.json");

fs.ensureDirSync(DATA_DIR);

let requestCount = 0;
const recentMessages = new Map();

const TRIGGERS = [
  "baby", "bby", "bot", "babu", "babe", "jan",
  "janu", "bbz", "baby ai", "hey bot",
  "বট", "বেবি", "বাবু", "জান", "জানু",
  "নীলা", "নিলা", "জুই", "মিম", "পাখি",
  "তিশা", "পিয়া", "বলো বেবি"
];

const REPLIES = [
  "🙈💕 এই যে জানু, ডাকছো কেন? বলো শুনছি!",
  "😼💗 বেশি বট বট করো না, লজ্জা লাগে!",
  "🌸✨ হ্যাঁ বলো, তোমার কী সাহায্য লাগবে?",
  "🥹🫶 এই যে বাবু, আমি কিন্তু অনলাইনে আছি!",
  "😽💞 আমাকে ডাকলে কিছু তো বলতেই হবে!",
  "🐸💝 কী হয়েছে? মন খারাপ নাকি?",
  "🌷💚 আসসালামু আলাইকুম! কেমন আছো?",
  "🤭💕 বলো জান, কী বলতে চাও?",
  "😹💫 এত ডাকাডাকি কেন? মেসেজ দাও!",
  "💖🌻 তোমার মেসেজ পেয়ে হাজির হয়ে গেলাম!",
  "😌🩵 আমি শুনছি, এবার বলো কী হয়েছে!",
  "🙊🌺 বেবি হাজির! কী খবর তোমার?",
  "🐰💗 ডাক শুনেছি, এখন বলো কী চাই!",
  "✨🫶 হ্যালো! তোমার সঙ্গে কথা বলতে প্রস্তুত!",
  "🌸💌 একটা সুন্দর মেসেজ দাও, আমিও রিপ্লাই দেব!"
];

const STYLES = [
  "💠 ━━━━━━━━ ❖ ━━━━━━━━ 💠",
  "🌸༺♡༻🌸",
  "🩷⎯͢⎯⃝🌷⎯͢⎯⃝🩷",
  "╭━━━💫━━━╮",
  "꧁༺💖༻꧂"
];

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function boldEnglish(text) {
  const map = {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲",
    f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷",
    k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼",
    p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁",
    u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆",
    z: "𝘇",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘",
    F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝",
    K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢",
    P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧",
    U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬",
    Z: "𝗭"
  };

  return String(text).replace(/[a-zA-Z]/g, c => map[c] || c);
}

function formatReply(text) {
  return (
    random(STYLES) + "\n\n" +
    boldEnglish(text) +
    "\n\n" + random(STYLES) +
    "\n💠 " + OWNER
  );
}

function containsTrigger(text) {
  const lower = String(text || "").toLowerCase();

  return TRIGGERS.some(word => {
    const trigger = word.toLowerCase();

    if (/^[a-z ]+$/.test(trigger)) {
      const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|[^a-z])${escaped}($|[^a-z])`, "i")
        .test(lower);
    }

    return lower.includes(trigger);
  });
}

function isBotCall(text) {
  const lower = String(text || "").toLowerCase();
  return /(^|[^a-z])bot([^a-z]|$)/i.test(lower) ||
    lower.includes("বট") ||
    lower.includes("বেবি");
}

async function getApiReply(text, senderID) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        text: text,
        senderID: senderID
      },
      timeout: 8000,
      validateStatus: status => status >= 200 && status < 500
    });

    if (response.status === 404) return null;
    if (response.status < 200 || response.status >= 300) return null;

    const data = response.data;

    if (typeof data === "string" && data.trim()) {
      return data.trim();
    }

    if (data && typeof data === "object") {
      const answer =
        data.reply ||
        data.response ||
        data.message ||
        data.answer ||
        data.data?.reply;

      if (typeof answer === "string" && answer.trim()) {
        return answer.trim();
      }
    }

    return null;
  } catch (error) {
    console.log(
      "[BABY AI] API error:",
      error.response?.status || error.code || error.message
    );
    return null;
  }
}

async function getProfilePicture(senderID) {
  try {
    // Graph API-এর পাবলিক ছবি চেষ্টা করা হবে।
    // ছবি না পাওয়া গেলে কোনো ভুয়া ছবি পাঠানো হবে না।
    const url =
      `https://graph.facebook.com/${encodeURIComponent(senderID)}/picture` +
      "?type=large&width=720&height=720";

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 7000,
      maxRedirects: 5,
      validateStatus: status => status >= 200 && status < 400
    });

    const buffer = Buffer.from(response.data);

    if (
      buffer.length < 1000 ||
      !String(response.headers["content-type"] || "").startsWith("image/")
    ) {
      return null;
    }

    const imagePath = path.join(
      os.tmpdir(),
      `baby-profile-${Date.now()}-${Math.random()
        .toString(36).slice(2)}.jpg`
    );

    await fs.writeFile(imagePath, buffer);
    return imagePath;
  } catch (error) {
    console.log("[BABY AI] Profile picture unavailable.");
    return null;
  }
}

function sendText(api, event, text) {
  return new Promise(resolve => {
    api.sendMessage(
      text,
      event.threadID,
      () => resolve(),
      event.messageID
    );
  });
}

async function sendProfile(api, event, senderID) {
  let imagePath = null;

  try {
    imagePath = await getProfilePicture(senderID);

    const caption = formatReply(
      "🐰💗 তুমি আমাকে বট বলে ডাকছো! এই নাও, তোমার প্রোফাইল ছবি দেখানোর চেষ্টা করলাম।"
    ) +
      "\n\n📘 Facebook ID: " + FACEBOOK_ID +
      "\n📱 WhatsApp: " + WHATSAPP;

    if (imagePath) {
      await new Promise(resolve => {
        api.sendMessage(
          {
            body: caption,
            attachment: fs.createReadStream(imagePath)
          },
          event.threadID,
          () => resolve(),
          event.messageID
        );
      });
    } else {
      await sendText(
        api,
        event,
        caption +
          "\n\n⚠️ প্রোফাইল ছবি পাওয়া যায়নি। Facebook-এর অনুমতি বা API সীমাবদ্ধতা থাকতে পারে।"
      );
    }
  } catch (error) {
    console.log("[BABY AI] Profile send error:", error.message);

    await sendText(
      api,
      event,
      formatReply("ছবিটি পাঠানো যায়নি। আবার চেষ্টা করো।")
    );
  } finally {
    if (imagePath) {
      try {
        await fs.remove(imagePath);
      } catch (_) {}
    }
  }
}

function isDisabled(threadID) {
  try {
    if (!fs.existsSync(OFF_FILE)) return false;

    const data = fs.readJsonSync(OFF_FILE, { throws: false }) || {};
    return data[String(threadID)] === true;
  } catch (_) {
    return false;
  }
}

function setDisabled(threadID, value) {
  let data = {};

  try {
    data = fs.readJsonSync(OFF_FILE, { throws: false }) || {};
  } catch (_) {}

  data[String(threadID)] = value;
  fs.writeJsonSync(OFF_FILE, data, { spaces: 2 });
}

module.exports = function ({ api, event }) {
  if (!api || !event || !event.threadID) return;

  const body = String(event.body || "").trim();
  if (!body) return;

  const threadID = String(event.threadID);
  const senderID = String(event.senderID || "");
  const messageID = event.messageID;

  // Admin command: baby on / baby off
  const lower = body.toLowerCase();

  if (/^baby\s+off$/i.test(body) || body === "বেবি অফ") {
    setDisabled(threadID, true);
    return sendText(
      api,
      event,
      formatReply("🔕 এই গ্রুপে BABY Auto Reply বন্ধ করা হয়েছে।")
    );
  }

  if (/^baby\s+on$/i.test(body) || body === "বেবি অন") {
    setDisabled(threadID, false);
    return sendText(
      api,
      event,
      formatReply("🔔 এই গ্রুপে BABY Auto Reply চালু করা হয়েছে।")
    );
  }

  if (isDisabled(threadID)) return;
  if (!containsTrigger(body)) return;

  // একই মেসেজে একাধিক event এলে দ্বিতীয়বার উত্তর দেবে না।
  if (messageID) {
    if (recentMessages.has(messageID)) return;
    recentMessages.set(messageID, Date.now());

    if (recentMessages.size > 500) {
      const cutoff = Date.now() - 30000;

      for (const [id, time] of recentMessages) {
        if (time < cutoff) recentMessages.delete(id);
      }
    }
  }

  requestCount++;

  (async () => {
    // বট বলে ডাকলে caller-এর প্রোফাইল ছবি দেখানোর চেষ্টা করবে।
    if (isBotCall(body) && senderID) {
      return sendProfile(api, event, senderID);
    }

    // আগে API থেকে উত্তর; API ব্যর্থ হলে স্থানীয় রিপ্লাই।
    const answer = await getApiReply(body, senderID);
    const reply = answer || random(REPLIES);

    return sendText(api, event, formatReply(reply));
  })().catch(error => {
    console.log("[BABY AI] Handler error:", error.message);
  });
};

module.exports.config = {
  name: "baby",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Stylish Baby AI Auto Reply",
  commandCategory: "AI",
  usages: "baby / bot / বেবি / বট",
  cooldowns: 2
};
    
