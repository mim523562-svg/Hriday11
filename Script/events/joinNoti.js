/**
 * ╔══════════════════════════════════════════════╗
 * ║        💠 HRIDOY BOT JOINNOTI V8 💠          ║
 * ║        Developer: HRIDOY HASAN SHANTO        ║
 * ╚══════════════════════════════════════════════╝
 */

const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "8.0.0",
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description:
    "HRIDOY BOT V8 | VIP Join | Daily Report | Auto Frame | Welcome System",
  dependencies: {
    axios: "",
    "moment-timezone": "",
    "fs-extra": ""
  }
};

const CACHE_DIR = path.join(__dirname, "cache");
const DAILY_FILE = path.join(CACHE_DIR, "dailyJoin.json");
const FRAME_FILE = path.join(CACHE_DIR, "frame.json");

const TIMEZONE = "Asia/Kuala_Lumpur";
const COOLDOWN_MS = 30000;

// নিজের বা বিশ্বস্ত VIP সদস্যদের UID এখানে দাও।
const VIP_UID = ["61591542717221"];

// নিজের বটের নাম ও মালিকের নাম
const BOT_NAME = "💠 HRIDOY BOT V8 💠";
const OWNER_NAME = "💫 HRIDOY HASAN SHANTO 💫";

// ১০টি ওয়েলকাম ডিজাইন
const FRAMES = [
  {
    top: "╔═══════〔 💠 WELCOME 💠 〕═══════╗",
    bottom: "╚═══════════════════════════════╝"
  },
  {
    top: "┏━━━━━━━〔 🌸 WELCOME 🌸 〕━━━━━━━┓",
    bottom: "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
  },
  {
    top: "『━━━━━━━━━ 👑 ━━━━━━━━━』",
    bottom: "『━━━━━━━━━━━━━━━━━━━━━━』"
  },
  {
    top: "꧁༺ 💖 WELCOME 💖 ༻꧂",
    bottom: "꧁༺══════════════════༻꧂"
  },
  {
    top: "╭━━━〔 ✨ NEW MEMBER ✨ 〕━━━╮",
    bottom: "╰━━━━━━━━━━━━━━━━━━━━━━╯"
  },
  {
    top: "★━━━━━━━━〔 🦋 HI 🦋 〕━━━━━━━━★",
    bottom: "★━━━━━━━━━━━━━━━━━━━━━━━━★"
  },
  {
    top: "◈━━━━━━━━〔 💐 WELCOME 💐 〕━━━━━━━━◈",
    bottom: "◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈"
  },
  {
    top: "༄ᶦᶰᵈ᭄✿ WELCOME ✿",
    bottom: "༄ᶦᶰᵈ᭄✿ HRIDOY BOT ✿"
  },
  {
    top: "╔═══ஓ๑♡๑ஓ═══╗",
    bottom: "╚═══ஓ๑♡๑ஓ═══╝"
  },
  {
    top: "⫷━━━━━━〔 🔥 WELCOME 🔥 〕━━━━━━⫸",
    bottom: "⫷━━━━━━━━━━━━━━━━━━━━━━━━━━⫸"
  }
];

const WELCOME_LINES = [
  "তোমাকে আমাদের গ্রুপে স্বাগতম! 😊",
  "নতুন সদস্য, তোমার আগমনে আড্ডা জমে উঠুক! 💖",
  "হাসিখুশি থেকো, সবার সঙ্গে সুন্দরভাবে কথা বলো। 🌸",
  "গ্রুপের সবাইকে পরিচিত হয়ে নাও! 🦋",
  "তোমার জন্য রইল অনেক ভালোবাসা ও শুভকামনা। 💐",
  "নতুন বন্ধু পেয়ে আমরা আনন্দিত! 🥰",
  "গ্রুপের নিয়ম মেনে সবার সঙ্গে আড্ডা দাও। ✨",
  "তোমার উপস্থিতিতে আমাদের পরিবার আরও বড় হলো! 👑",
  "স্বাগতম! সুন্দর সময় কাটুক সবার সঙ্গে। 💫",
  "আড্ডা দাও, হাসো আর সবাইকে সম্মান করো। 💠"
];

const cooldown = Object.create(null);

function ensureFiles() {
  fs.ensureDirSync(CACHE_DIR);

  if (!fs.existsSync(DAILY_FILE)) {
    fs.writeJsonSync(DAILY_FILE, {});
  }

  if (!fs.existsSync(FRAME_FILE)) {
    fs.writeJsonSync(FRAME_FILE, {});
  }
}

function readJson(file) {
  try {
    if (!fs.existsSync(file)) return {};
    const data = fs.readJsonSync(file);
    return data && typeof data === "object" ? data : {};
  } catch (error) {
    console.error(`[JOINNOTI V8] JSON read error: ${file}`, error.message);
    return {};
  }
}

function writeJson(file, data) {
  try {
    fs.ensureDirSync(CACHE_DIR);
    fs.writeJsonSync(file, data, { spaces: 2 });
  } catch (error) {
    console.error(`[JOINNOTI V8] JSON write error: ${file}`, error.message);
  }
}

function getDailyData() {
  return readJson(DAILY_FILE);
}

function getFrameData() {
  return readJson(FRAME_FILE);
}

function getNextFrame(threadID) {
  const frameData = getFrameData();
  const current = Number(frameData[threadID] || 0);
  const next = (current % FRAMES.length) + 1;

  frameData[threadID] = next;
  writeJson(FRAME_FILE, frameData);

  return FRAMES[next - 1];
}

function updateDailyCount(threadID, amount) {
  const data = getDailyData();
  const today = moment().tz(TIMEZONE).format("YYYY-MM-DD");

  if (!data[today]) data[today] = {};
  if (!data[today][threadID]) {
    data[today][threadID] = {
      count: 0,
      lastUpdate: moment().tz(TIMEZONE).format("HH:mm:ss")
    };
  }

  data[today][threadID].count += amount;
  data[today][threadID].lastUpdate =
    moment().tz(TIMEZONE).format("HH:mm:ss");

  // পুরোনো দিনের রেকর্ড সীমিত রাখা
  const dates = Object.keys(data).sort();
  while (dates.length > 30) {
    delete data[dates.shift()];
  }

  writeJson(DAILY_FILE, data);
  return data[today][threadID].count;
}

function getDailyCount(threadID) {
  const data = getDailyData();
  const today = moment().tz(TIMEZONE).format("YYYY-MM-DD");
  return data[today]?.[threadID]?.count || 0;
}

async function getName(api, uid) {
  try {
    const info = await api.getUserInfo(uid);
    return info?.[uid]?.name || `Member ${uid}`;
  } catch (error) {
    return `Member ${uid}`;
  }
}

async function getAvatar(uid) {
  // Access token কোডে হার্ডকোড না করে সাধারণ প্রোফাইল URL ব্যবহার।
  // Facebook অনুমতি না দিলে ছবি বাদ দিয়ে মেসেজ পাঠানো হবে।
  try {
    const url =
      `https://graph.facebook.com/${encodeURIComponent(uid)}/picture?width=512&height=512`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 8000,
      maxRedirects: 5,
      validateStatus: status => status >= 200 && status < 400
    });

    const contentType = response.headers["content-type"] || "";

    if (!contentType.startsWith("image/")) return null;

    const stream = require("stream");
    return stream.Readable.from(Buffer.from(response.data));
  } catch (error) {
    return null;
  }
}

function sendMessage(api, message, threadID, messageID) {
  return new Promise(resolve => {
    try {
      api.sendMessage(message, threadID, error => {
        if (error) {
          console.error("[JOINNOTI V8] Send error:", error.message || error);
        }
        resolve(!error);
      }, messageID);
    } catch (error) {
      console.error("[JOINNOTI V8] Send exception:", error.message);
      resolve(false);
    }
  });
}

module.exports.run = async function ({ api, event }) {
  ensureFiles();

  const threadID = event.threadID;
  const messageID = event.messageID;
  const logData = event.logMessageData || {};
  const participants = Array.isArray(logData.addedParticipants)
    ? logData.addedParticipants
    : [];

  if (!participants.length) return;

  const botID = String(api.getCurrentUserID());
  const addedIDs = participants
    .map(person => String(person.userFbId || person.id || ""))
    .filter(Boolean);

  if (!addedIDs.length) return;

  // বটকে গ্রুপে অ্যাড করলে আলাদা বার্তা
  if (addedIDs.includes(botID)) {
    const prefix =
      global.config?.PREFIX ||
      global.config?.prefix ||
      ".";

    const botWelcome =
      `╔════════════════════════════╗\n` +
      `      💠 ${BOT_NAME} 💠\n` +
      `╚════════════════════════════╝\n\n` +
      `✅ আমাকে গ্রুপে যুক্ত করার জন্য ধন্যবাদ!\n\n` +
      `⚙️ কমান্ড দেখতে লিখুন: ${prefix}help\n` +
      `👑 Owner: ${OWNER_NAME}\n` +
      `💫 Powered by ${BOT_NAME}`;

    await sendMessage(api, botWelcome, threadID, messageID);
  }

  const now = Date.now();

  // প্রতি গ্রুপে cooldown
  if (cooldown[threadID] && now - cooldown[threadID] < COOLDOWN_MS) {
    return;
  }

  cooldown[threadID] = now;

  try {
    const adderID = String(logData.addedBy || "");
    const adderName = adderID
      ? await getName(api, adderID)
      : "কেউ একজন";

    const date = moment().tz(TIMEZONE).format("DD-MM-YYYY");
    const time = moment().tz(TIMEZONE).format("hh:mm:ss A");

    for (const uid of addedIDs) {
      if (uid === botID) continue;

      const memberName = await getName(api, uid);
      const isVIP = VIP_UID.includes(uid);
      const dailyCount = updateDailyCount(threadID, 1);
      const frame = getNextFrame(threadID);
      const line =
        WELCOME_LINES[Math.floor(Math.random() * WELCOME_LINES.length)];

      let message;

      if (isVIP) {
        message =
          `${frame.top}\n\n` +
          `👑✨ VIP MEMBER JOINED ✨👑\n\n` +
          `💎 নাম: ${memberName}\n` +
          `🆔 UID: ${uid}\n` +
          `🌟 Status: VIP Member\n` +
          `➕ Added by: ${adderName}\n\n` +
          `💖 আমাদের গ্রুপে VIP সদস্যকে স্বাগতম!\n` +
          `👑 ${OWNER_NAME}\n\n` +
          `${frame.bottom}`;
      } else {
        message =
          `${frame.top}\n\n` +
          `👋 স্বাগতম, ${memberName}!\n\n` +
          `💠 তুমি এখন আমাদের গ্রুপের একজন সদস্য।\n` +
          `💬 ${line}\n\n` +
          `👤 Added by: ${adderName}\n` +
          `📅 Date: ${date}\n` +
          `🕒 Time: ${time}\n` +
          `📊 আজকের Join Count: ${dailyCount}\n\n` +
          `🤖 ${BOT_NAME}\n` +
          `👑 ${OWNER_NAME}\n\n` +
          `${frame.bottom}`;
      }

      // ছবি পাওয়া গেলে ছবি সহ পাঠাবে; না পেলে শুধু টেক্সট।
      let avatar = null;
      try {
        avatar = await getAvatar(uid);
      } catch (_) {}

      if (avatar) {
        try {
          await new Promise(resolve => {
            api.sendMessage(
              { body: message, attachment: avatar },
              threadID,
              error => {
                if (error) {
                  console.error("[JOINNOTI V8] Image send error:", error.message || error);
                  sendMessage(api, message, threadID, messageID).finally(resolve);
                } else {
                  resolve();
                }
              },
              messageID
            );
          });
        } catch (error) {
          await sendMessage(api, message, threadID, messageID);
        }
      } else {
        await sendMessage(api, message, threadID, messageID);
      }
    }

    // একসঙ্গে অনেক সদস্য যোগ হলে আলাদা রিপোর্ট
    if (addedIDs.filter(uid => uid !== botID).length >= 5) {
      const newCount = getDailyCount(threadID);

      await sendMessage(
        api,
        `╔═══════〔 🔥 BULK JOIN REPORT 🔥 〕═══════╗\n\n` +
        `👥 একসঙ্গে ${addedIDs.filter(uid => uid !== botID).length} জন সদস্য যোগ হয়েছে!\n` +
        `➕ Added by: ${adderName}\n` +
        `📊 আজকের মোট Join: ${newCount}\n` +
        `🤖 ${BOT_NAME}\n\n` +
        `╚═══════════════════════════════════════╝`,
        threadID,
        messageID
      );
    }
  } catch (error) {
    console.error("[JOINNOTI V8] Event error:", error.stack || error);
  } finally {
    setTimeout(() => {
      delete cooldown[threadID];
    }, COOLDOWN_MS);
  }
};
