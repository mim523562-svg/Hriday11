/**
 * ╔══════════════════════════════════════════╗
 * ║        💠 HRIDOY PREFIX SYSTEM V4        ║
 * ║        💖 HRIDOY HASAN SHANTO 💖         ║
 * ║             MIRAI BOT FIX                ║
 * ╚══════════════════════════════════════════╝
 */

const spamMap = new Map();
const SPAM_COOLDOWN = 10000;

module.exports.config = {
  name: "prefix",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Prefix Information System",
  commandCategory: "Information",
  usages: "prefix",
  cooldowns: 3
};

const OWNER_FB =
  "https://www.facebook.com/share/1DQCCDQ1iV/";

const TRIGGERS = [
  "prefix",
  "mprefix",
  "mpre",
  "bot prefix",
  "what is the prefix",
  "what prefix",
  "bot name",
  "how to use bot",
  "prefx",
  "prfix",
  "perfix",
  "freefix",
  "প্রিফিক্স",
  "বট প্রিফিক্স",
  "বটের নাম",
  "বট কি",
  "প্রিফিক্স কি",
  "বট কাজ করছে না",
  "বট অফলাইন",
  "প্রীফিক্স",
  "বটের প্রিফিক্স"
];

function getPrefix(threadID) {
  try {
    const threadData = global.data?.threadData;

    if (threadData) {
      let settings = threadData.get(String(threadID));

      if (!settings && /^\d+$/.test(String(threadID))) {
        settings = threadData.get(Number(threadID));
      }

      if (settings && settings.PREFIX) {
        return settings.PREFIX;
      }
    }
  } catch (err) {
    console.error("[PREFIX DATA ERROR]", err.message);
  }

  return global.config?.PREFIX || ".";
}

function getUptime() {
  const seconds = Math.floor(process.uptime());
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days} দিন ${hours} ঘণ্টা ${minutes} মিনিট`;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "🌅 শুভ সকাল";
  if (hour >= 12 && hour < 17) return "☀️ শুভ দুপুর";
  if (hour >= 17 && hour < 21) return "🌆 শুভ সন্ধ্যা";

  return "🌙 শুভ রাত্রি";
}

function getBotInfo(event, prefix) {
  const users = global.data?.allUserID || [];
  const threads = global.data?.allThreadID || [];

  const botName = global.config?.BOTNAME || "HRIDOY BOT V4";

  return `
╭━━━〔 💠 HRIDOY BOT 💠 〕━━━╮
┃
┃ ${getGreeting()} ❤️
┃ স্বাগতম আমার বট সিস্টেমে!
┃
┣━━━━━━━━━━━━━━━━━━
┃ 💎 BOT INFORMATION
┣━━━━━━━━━━━━━━━━━━
┃ ✦ বটের নাম: ${botName}
┃ ✦ Prefix: 「 ${prefix} 」
┃ ✦ Version: 4.0.0
┃ ✦ Uptime: ${getUptime()}
┃ ✦ Status: 🟢 Online
┃
┣━━━━━━━━━━━━━━━━━━
┃ 📊 BOT STATISTICS
┣━━━━━━━━━━━━━━━━━━
┃ 👥 মোট ইউজার: ${users.length}
┃ 💬 মোট গ্রুপ: ${threads.length}
┃ 🆔 Thread ID: ${event.threadID}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 👑 OWNER INFORMATION
┣━━━━━━━━━━━━━━━━━━
┃ ✦ নাম: হৃদয় হাসান শান্ত
┃ ✦ Facebook:
┃ ${OWNER_FB}
┃
┣━━━━━━━━━━━━━━━━━━
┃ ⚡ COMMAND USAGE
┣━━━━━━━━━━━━━━━━━━
┃ ✦ Prefix জানতে: prefix
┃ ✦ Help দেখতে: ${prefix}help
┃ ✦ সব কমান্ড: ${prefix}helpall
┃
╰━━━〔 💖 POWERED BY HRIDOY 〕━━━╯

💠 ভালো থাকুন, বটের সাথে থাকুন! 💠
`.trim();
}

function sendInfo(api, event) {
  const prefix = getPrefix(event.threadID);
  const message = getBotInfo(event, prefix);

  return api.sendMessage(message, event.threadID, (err) => {
    if (err) {
      console.error("[PREFIX SEND ERROR]", err);
    }
  });
}

/**
 * Automatic prefix reply
 * Example: prefix / প্রিফিক্স
 */
module.exports.handleEvent = async function ({ event, api }) {
  try {
    if (!event || !api) return;

    const { threadID, senderID, body } = event;

    if (!threadID || !senderID || typeof body !== "string") {
      return;
    }

    const text = body.trim().toLowerCase();

    if (!TRIGGERS.includes(text)) return;

    const now = Date.now();
    const key = `${threadID}_${senderID}`;
    const lastTime = spamMap.get(key) || 0;

    if (now - lastTime < SPAM_COOLDOWN) return;

    spamMap.set(key, now);

    // Clean expired entries to avoid unnecessary memory use
    if (spamMap.size > 2000) {
      for (const [mapKey, time] of spamMap.entries()) {
        if (now - time >= SPAM_COOLDOWN) {
          spamMap.delete(mapKey);
        }
      }
    }

    return sendInfo(api, event);
  } catch (err) {
    console.error("[HRIDOY PREFIX EVENT ERROR]", err);
  }
};

/**
 * Manual command
 * Example: .prefix
 */
module.exports.run = async function ({ event, api }) {
  try {
    if (!event || !api || !event.threadID) return;

    return sendInfo(api, event);
  } catch (err) {
    console.error("[HRIDOY PREFIX COMMAND ERROR]", err);
  }
};
