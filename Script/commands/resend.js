/**
 * ╔══════════════════════════════════════════╗
 * ║          💠 RESEND SYSTEM V3             ║
 * ║       ON / OFF CONTROL + AUTO RESEND     ║
 * ║       💠 HRIDOY HASAN SHANTO 💠          ║
 * ╚══════════════════════════════════════════╝
 */

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

module.exports.config = {
  name: "resend",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Auto resend removed messages with ON/OFF control",
  commandCategory: "general",
  usages: "[on/off/status]",
  cooldowns: 2,
  hide: false,
  dependencies: {
    "fs-extra": "",
    axios: ""
  }
};

// ================================
// 💾 MESSAGE STORAGE
// ================================
if (!global.logMessage) {
  global.logMessage = new Map();
}

// ================================
// ⚙️ EVENT HANDLER
// ================================
module.exports.handleEvent = async function ({
  event,
  api,
  Users
}) {
  try {
    const {
      threadID,
      messageID,
      senderID,
      body,
      attachments,
      type
    } = event;

    if (!global.data.threadData) return;

    if (!global.data.botID) {
      global.data.botID = api.getCurrentUserID();
    }

    if (senderID === global.data.botID) return;

    const threadData =
      global.data.threadData.get(threadID) || {};

    // OFF থাকলে কোনো মেসেজ লগ বা রিসেন্ড হবে না
    if (threadData.resend === false) return;

    // সাধারণ মেসেজ সংরক্ষণ
    if (type !== "message_unsend") {
      global.logMessage.set(messageID, {
        msgBody: body || "",
        attachment: attachments || [],
        senderID,
        threadID
      });

      // মেমোরি সীমিত রাখা
      if (global.logMessage.size > 2000) {
        const firstKey = global.logMessage.keys().next().value;
        global.logMessage.delete(firstKey);
      }

      return;
    }

    // মুছে ফেলা মেসেজ শনাক্ত
    const msg = global.logMessage.get(messageID);
    if (!msg || msg.threadID !== threadID) return;

    global.logMessage.delete(messageID);

    const userName = await Users.getNameUser(msg.senderID);
    const tag = `@${userName}`;

    // কোনো টেক্সট বা অ্যাটাচমেন্ট না থাকলে
    if (!msg.msgBody && !msg.attachment.length) return;

    const message = {
      body:
        `╭━━━〔 💠 RESEND ALERT 💠 〕━━━╮\n\n` +
        `👤 মেম্বার: ${tag}\n` +
        `🗑️ একটি মেসেজ রিমুভ করা হয়েছে!\n\n` +
        (msg.msgBody
          ? `📝 মেসেজ:\n${msg.msgBody}\n\n`
          : "") +
        `╰━━〔 HRIDOY HASAN SHANTO 〕━━╯`,
      mentions: [{
        tag,
        id: msg.senderID
      }]
    };

    // টেক্সট পাঠানো
    if (!msg.attachment.length) {
      return api.sendMessage(message, threadID);
    }

    // অ্যাটাচমেন্ট ডাউনলোড ও পাঠানো
    await fs.ensureDir(CACHE_DIR);

    const streams = [];
    const tempFiles = [];

    for (let i = 0; i < msg.attachment.length; i++) {
      const file = msg.attachment[i];

      if (!file.url) continue;

      const response = await axios.get(file.url, {
        responseType: "arraybuffer",
        timeout: 20000,
        maxRedirects: 5
      });

      const ext = (
        file.type === "photo" ? "jpg" :
        file.type === "video" ? "mp4" :
        file.type === "audio" ? "mp3" :
        file.type === "animated_image" ? "gif" :
        "bin"
      );

      const filePath = path.join(
        CACHE_DIR,
        `resend_${Date.now()}_${i}.${ext}`
      );

      await fs.writeFile(filePath, response.data);

      tempFiles.push(filePath);
      streams.push(fs.createReadStream(filePath));
    }

    if (streams.length) {
      await new Promise(resolve => {
        api.sendMessage(
          { ...message, attachment: streams },
          threadID,
          () => {
            streams.forEach(stream => {
              if (!stream.destroyed) stream.destroy();
            });

            setTimeout(() => {
              tempFiles.forEach(file => {
                fs.remove(file).catch(() => {});
              });
            }, 1000);

            resolve();
          }
        );
      });
    } else {
      api.sendMessage(message, threadID);
    }

  } catch (error) {
    console.error(
      "[RESEND ERROR]",
      error.message
    );
  }
};

// ================================
// 🎛️ ON / OFF COMMAND
// ================================
module.exports.run = async function ({
  api,
  event,
  args,
  Threads
}) {
  try {
    const { threadID, messageID } = event;

    const input = (args[0] || "").toLowerCase();

    const threadInfo = await Threads.getData(threadID);
    const data = threadInfo.data || {};

    if (input === "on") {
      data.resend = true;
    } else if (input === "off") {
      data.resend = false;
    } else if (input === "status") {
      const enabled = data.resend !== false;

      return api.sendMessage(
        `╭━━━〔 💠 RESEND STATUS 💠 〕━━━╮\n\n` +
        `${enabled ? "🟢 STATUS: ON" : "🔴 STATUS: OFF"}\n\n` +
        `╰━━〔 HRIDOY HASAN SHANTO 〕━━╯`,
        threadID,
        messageID
      );
    } else {
      // কোনো আর্গুমেন্ট না দিলে টগল
      data.resend = !(data.resend !== false);
    }

    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);

    const enabled = data.resend !== false;

    return api.sendMessage(
      `╭━━━〔 💠 RESEND CONTROL 💠 〕━━━╮\n\n` +
      `${enabled ? "🟢 RESEND SUCCESSFULLY ON" : "🔴 RESEND SUCCESSFULLY OFF"}\n\n` +
      `${enabled
        ? "✅ ডিলিট করা মেসেজ শনাক্ত করা চালু হয়েছে।"
        : "⛔ ডিলিট করা মেসেজ শনাক্ত করা বন্ধ হয়েছে।"}\n\n` +
      `╰━━〔 HRIDOY HASAN SHANTO 〕━━╯`,
      threadID,
      messageID
    );

  } catch (error) {
    console.error("[RESEND COMMAND ERROR]", error);

    return api.sendMessage(
      "❌ Resend সেটিংস পরিবর্তন করা যায়নি। Threads ডেটাবেস পরীক্ষা করো।",
      event.threadID,
      event.messageID
    );
  }
};
