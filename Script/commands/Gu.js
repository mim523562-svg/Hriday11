const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "gu",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Local frame image sender without API",
  commandCategory: "Image",
  usages: "[@mention/reply/uid/link]",
  cooldowns: 5
};

const CREDIT = "💠 HRIDOY HASAN SHANTO 💠";
const FRAME_PATH = path.join(__dirname, "gu.png");

async function resolveUser(api, event, args) {
  // Reply
  if (event.type === "message_reply" && event.messageReply) {
    return event.messageReply.senderID;
  }

  // Mention
  const mentions = event.mentions || {};
  const mentionedID = Object.keys(mentions)[0];

  if (mentionedID) return mentionedID;

  // Arguments
  const input = args.join(" ").trim();
  if (!input) return null;

  // UID
  if (/^\d+$/.test(input)) return input;

  // Profile link
  if (/^https?:\/\//i.test(input)) {
    if (typeof api.getUID !== "function") {
      throw new Error("এই বট সিস্টেমে api.getUID পাওয়া যায়নি।");
    }
    return await api.getUID(input);
  }

  return null;
}

module.exports.run = async function ({ api, event, args }) {
  let waiting;

  try {
    if (!fs.existsSync(FRAME_PATH)) {
      return api.sendMessage(
        "❌ gu.png পাওয়া যায়নি!\n" +
        "📁 gu.js ফাইলের একই ফোল্ডারে gu.png রাখো।",
        event.threadID,
        event.messageID
      );
    }

    const targetID = await resolveUser(api, event, args);

    if (!targetID) {
      return api.sendMessage(
        "❌ একজনকে মেনশন, রিপ্লাই অথবা UID দাও।\n\n" +
        "উদাহরণ: gu @mention\n" +
        "অথবা কারও মেসেজে রিপ্লাই দিয়ে gu লেখো।",
        event.threadID,
        event.messageID
      );
    }

    waiting = await api.sendMessage(
      "⏳ ফ্রেমের ছবি পাঠানো হচ্ছে...",
      event.threadID
    );

    let userName = "Unknown";

    try {
      const info = await api.getUserInfo(targetID);
      userName = info?.[targetID]?.name || "Unknown";
    } catch (_) {}

    const message = {
      body:
        "🎨 GU FRAME\n\n" +
        "👤 Name: " + userName + "\n" +
        "🆔 UID: " + targetID + "\n\n" +
        CREDIT,
      mentions: [{
        tag: userName,
        id: targetID
      }],
      attachment: fs.createReadStream(FRAME_PATH)
    };

    if (waiting?.messageID) {
      try {
        await api.unsendMessage(waiting.messageID);
      } catch (_) {}
    }

    return api.sendMessage(
      message,
      event.threadID,
      event.messageID
    );

  } catch (error) {
    if (waiting?.messageID) {
      try {
        await api.unsendMessage(waiting.messageID);
      } catch (_) {}
    }

    return api.sendMessage(
      "⚠️ GU কমান্ডে সমস্যা হয়েছে!\n" +
      "কারণ: " + (error.message || "Unknown error") + "\n\n" +
      CREDIT,
      event.threadID,
      event.messageID
    );
  }
};
