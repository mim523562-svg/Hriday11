/**
 * ╔══════════════════════════════════════╗
 * ║           💗 RIYA BOT V4 💗          ║
 * ║         ✨ ANTI OUT SYSTEM ✨         ║
 * ║       💠 HRIDOY HASAN SHANTO 💠      ║
 * ╚══════════════════════════════════════╝
 *
 * Mirai Legacy
 * File: scripts/events/antiout.js
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "4.0.0",
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "RIYA BOT Stylish Anti Out System"
};

const VIDEO_URL = "https://files.catbox.moe/bk1i4z.mp4";
const CACHE_DIR = path.join(__dirname, "cache");
const VIDEO_PATH = path.join(CACHE_DIR, "riya_antiout.mp4");

const ADMIN_UIDS = [
  "61567576882007",
  "100071528325738"
];

// লিভ কাউন্ট (বট চালু থাকা পর্যন্ত)
const leaveData = Object.create(null);

function frame(message) {
  return `
╭━━━〔 💗 𝐑𝐈𝐘𝐀 𝐁𝐎𝐓 💗 〕━━━╮
┃     ✨ 𝐀𝐍𝐓𝐈 𝐎𝐔𝐓 𝐒𝐘𝐒𝐓𝐄𝐌 ✨
╰━━━━━━━━━━━━━━━━━━━━╯

${message}

╭━━━〔 👑 𝐁𝐎𝐓 𝐂𝐑𝐄𝐃𝐈𝐓 〕━━━╮
┃ 💠 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎
╰━━━━━━━━━━━━━━━━━━━━╯`;
}

async function getVideo() {
  await fs.ensureDir(CACHE_DIR);

  if (
    await fs.pathExists(VIDEO_PATH) &&
    (await fs.stat(VIDEO_PATH)).size > 1000
  ) {
    return VIDEO_PATH;
  }

  const response = await axios.get(VIDEO_URL, {
    responseType: "arraybuffer",
    timeout: 30000,
    maxContentLength: 25 * 1024 * 1024
  });

  const buffer = Buffer.from(response.data);

  if (buffer.length < 1000) {
    throw new Error("Invalid video file");
  }

  await fs.writeFile(VIDEO_PATH, buffer);
  return VIDEO_PATH;
}

async function sendFunny(api, threadID, message) {
  try {
    const videoPath = await getVideo();

    await new Promise((resolve, reject) => {
      api.sendMessage({
        body: message,
        attachment: fs.createReadStream(videoPath)
      }, threadID, error => {
        if (error) reject(error);
        else resolve();
      });
    });
  } catch (error) {
    console.log("[RIYA VIDEO ERROR]", error.message);
    api.sendMessage(message, threadID);
  }
}

async function notifyAdmins(api, message) {
  for (const uid of ADMIN_UIDS) {
    await new Promise(resolve => {
      api.sendMessage(message, uid, () => resolve());
    });
  }
}

module.exports.run = async function ({
  event,
  api,
  Threads,
  Users
}) {
  try {
    const threadID = event.threadID;
    const leftID =
      event.logMessageData?.leftParticipantFbId;

    if (!threadID || !leftID) return;

    // বট নিজে লিভ করলে বাদ
    if (String(leftID) === String(api.getCurrentUserID())) {
      return;
    }

    // ইউজার নিজে লিভ না করলে বাদ
    if (String(event.author) !== String(leftID)) return;

    // গ্রুপের Antiout সেটিং
    let threadData = {};

    try {
      const result = await Threads.getData(threadID);
      threadData = result.data || {};
    } catch (error) {
      console.log("[RIYA THREAD ERROR]", error.message);
    }

    if (threadData.antiout === false) return;

    // ইউজারের নাম
    let name = `User ${leftID}`;

    try {
      name =
        global.data?.userName?.get(String(leftID)) ||
        (await Users.getNameUser(String(leftID))) ||
        name;
    } catch (_) {}

    // কাউন্ট তৈরি
    if (!leaveData[leftID]) {
      leaveData[leftID] = {
        count: 0,
        time: Date.now()
      };
    }

    const user = leaveData[leftID];

    // এক ঘণ্টা পর কাউন্ট রিসেট
    if (Date.now() - user.time >= 3600000) {
      user.count = 0;
      user.time = Date.now();
    }

    user.count++;

    let threadName = "Unknown Group";

    try {
      const info = await Threads.getInfo(threadID);
      threadName = info.threadName || threadName;
    } catch (_) {}

    const time = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Kuala_Lumpur"
    });

    // তৃতীয়বার: রিপোর্ট
    if (user.count >= 3) {
      const message = frame(`
╭━━━〔 🚨 𝐋𝐈𝐌𝐈𝐓 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄 〕━━━╮

😈 ${name}, আবারও লিভ!
💀 তিনবারের সীমা পূর্ণ হয়েছে!
📩 অ্যাডমিনকে রিপোর্ট পাঠানো হয়েছে।

╰━━━━━━━━━━━━━━━━━━━━╯`);

      await sendFunny(api, threadID, message);

      await notifyAdmins(api, `
🚨 𝐑𝐈𝐘𝐀 𝐁𝐎𝐓 — 𝐀𝐍𝐓𝐈 𝐎𝐔𝐓

👤 Name: ${name}
🆔 UID: ${leftID}
📊 Count: ${user.count}/3
👥 Group: ${threadName}
🕒 Time: ${time}

💠 HRIDOY HASAN SHANTO 💠`);

      return;
    }

    // প্রথম ও দ্বিতীয়বার পুনরায় অ্যাড
    api.addUserToGroup(leftID, threadID, async error => {
      if (error) {
        await sendFunny(api, threadID, frame(`
╭━━━〔 😢 𝐑𝐄-𝐀𝐃𝐃 𝐅𝐀𝐈𝐋𝐄𝐃 〕━━━╮

💗 ${name}, তোকে ফেরানো গেল না!
🔒 Privacy অথবা Facebook restriction হতে পারে।
📊 Count: ${user.count}/3

╰━━━━━━━━━━━━━━━━━━━━╯`));

        await notifyAdmins(api, `
❌ 𝐑𝐈𝐘𝐀 𝐁𝐎𝐓 — 𝐑𝐄-𝐀𝐃𝐃 𝐅𝐀𝐈𝐋𝐄𝐃

👤 ${name}
🆔 ${leftID}
👥 ${threadName}
📊 Count: ${user.count}/3
🕒 ${time}`);

        return;
      }

      const message = user.count === 1
        ? frame(`
╭━━━〔 😏 𝐅𝐈𝐑𝐒𝐓 𝐖𝐀𝐑𝐍𝐈𝐍𝐆 〕━━━╮

💗 ${name}, পালানোর চেষ্টা করছিস?
😂 পালিয়ে লাভ নেই ভাই!

🔄 আবার গ্রুপে ফিরিয়ে আনা হলো!
⚠️ আর ২ বার বাকি!

╰━━━━━━━━━━━━━━━━━━━━╯`)
        : frame(`
╭━━━〔 🤣 𝐒𝐄𝐂𝐎𝐍𝐃 𝐖𝐀𝐑𝐍𝐈𝐍𝐆 〕━━━╮

💗 ${name}, আবারও পালালি!
🔄 তোকে আবার ফিরিয়ে আনা হলো!

💀 শেষ সতর্কবার্তা!
⚠️ আর ১ বার বাকি!

╰━━━━━━━━━━━━━━━━━━━━╯`);

      await sendFunny(api, threadID, message);

      await notifyAdmins(api, `
✅ 𝐑𝐈𝐘𝐀 𝐁𝐎𝐓 — 𝐑𝐄-𝐀𝐃𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒

👤 ${name}
🆔 UID: ${leftID}
👥 Group: ${threadName}
📊 Count: ${user.count}/3
🕒 Time: ${time}

💠 HRIDOY HASAN SHANTO 💠`);
    });

  } catch (error) {
    console.log("[RIYA ANTI OUT ERROR]", error);
  }
};
