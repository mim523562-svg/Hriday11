const fs = require("fs-extra");

module.exports.config = {
  name: "prefix",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Stylish Prefix System & Bot Information",
  commandCategory: "Information",
  usages: "[prefix]",
  cooldowns: 5
};

const spamMap = new Map();
const SPAM_COOLDOWN = 10000;

const TRIGGERS = [
  "prefix", "mprefix", "mpre", "bot prefix",
  "what is the prefix", "what prefix", "bot name",
  "how to use bot", "bot not working", "bot offline",
  "prefx", "prfix", "perfix", "freefix",
  "প্রিফিক্স", "বট প্রিফিক্স", "বটের নাম",
  "বট কি", "প্রিফিক্স কি", "বট কাজ করছে না",
  "বট অফলাইন", "প্রীফिक्स", "बॉट प्रीफिक्स"
];

const IMAGE_URL = "https://i.imgur.com/rNQJ9OA.jpeg";
const OWNER_FB = "https://www.facebook.com/share/1DQCCDQ1iV/";

function getPrefix(threadID) {
  try {
    const settings = global.data.threadData.get(
      parseInt(threadID)
    ) || {};

    return settings.PREFIX || global.config.PREFIX || ".";
  } catch {
    return global.config.PREFIX || ".";
  }
}

function getUptime() {
  const sec = Math.floor(process.uptime());
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);

  return `${d} দিন ${h} ঘণ্টা ${m} মিনিট`;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "🌅 শুভ সকাল";
  if (hour >= 12 && hour < 17) return "☀️ শুভ দুপুর";
  if (hour >= 17 && hour < 21) return "🌆 শুভ সন্ধ্যা";

  return "🌙 শুভ রাত্রি";
}

function getBotInfo(event, prefix) {
  const users = global.data.allUserID || [];
  const threads = global.data.allThreadID || [];

  const threadName =
    event.threadName ||
    "Messenger Group";

  return `╭━━━〔 💠 HRIDOY BOT 💠 〕━━━╮
┃
┃ ${getGreeting()} ❤️
┃ স্বাগতম আমার বট সিস্টেমে!
┃
┣━━━━━━━━━━━━━━━━━━
┃ 💠 BOT INFORMATION
┣━━━━━━━━━━━━━━━━━━
┃ ✦ বটের নাম: ${global.config.BOTNAME || "HRIDOY BOT V3"}
┃ ✦ Prefix: 「 ${prefix} 」
┃ ✦ Version: 3.0.0
┃ ✦ Uptime: ${getUptime()}
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
┃ ✦ Prefix জানতে লিখুন: prefix
┃ ✦ কমান্ড ব্যবহার করুন: ${prefix}help
┃
╰━━━〔 💖 POWERED BY HRIDOY 〕━━━╯

💠 ভালো থাকুন, বটের সাথে থাকুন! 💠`;
}

module.exports.handleEvent = async function ({
  event,
  api
}) {
  try {
    const { threadID, messageID, senderID, body } = event;

    if (!body || !threadID || !senderID) return;

    const text = body.trim().toLowerCase();

    if (!TRIGGERS.includes(text)) return;

    const now = Date.now();
    const last = spamMap.get(`${threadID}_${senderID}`) || 0;

    if (now - last < SPAM_COOLDOWN) return;

    spamMap.set(`${threadID}_${senderID}`, now);

    // Memory cleanup
    if (spamMap.size > 2000) {
      for (const [key, time] of spamMap) {
        if (now - time > SPAM_COOLDOWN) {
          spamMap.delete(key);
        }
      }
    }

    const reactions = ["💖", "✨", "🌸", "💫", "🦋"];

    if (typeof api.setMessageReaction === "function") {
      api.setMessageReaction(
        reactions[Math.floor(Math.random() * reactions.length)],
        messageID,
        () => {},
        true
      );
    }

    const prefix = getPrefix(threadID);
    const message = getBotInfo(event, prefix);

    return api.sendMessage(
      {
        body: message,
        attachment: await global.utils.getStreamFromURL(IMAGE_URL)
      },
      threadID
    );
  } catch (err) {
    console.error("[PREFIX ERROR]", err);
  }
};

module.exports.run = async function ({ event, api }) {
  const prefix = getPrefix(event.threadID);

  return api.sendMessage(
    getBotInfo(event, prefix),
    event.threadID
  );
};
