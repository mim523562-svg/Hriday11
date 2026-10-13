/**
 * ╔══════════════════════════════════════════╗
 * ║       💠 HRIDOY BOT SYSTEM V2 💠         ║
 * ║       OWNER: HRIDOY HASAN SHANTO         ║
 * ╚══════════════════════════════════════════╝
 */

module.exports.config = {
  name: "offbot",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "হৃদয় হাসান শান্ত",
  description: "Turn off the bot",
  commandCategory: "System",
  usages: "offbot",
  cooldowns: 0
};

module.exports.run = ({ event, api }) => {
  const permission = ["61593296285457"];

  if (!permission.includes(String(event.senderID))) {
    return api.sendMessage(
      "⛔ অনুমতি নেই!\n\n" +
      "💠 এই কমান্ডটি শুধু বটের মালিক ব্যবহার করতে পারবেন।",
      event.threadID,
      event.messageID
    );
  }

  const botName = global.config?.BOTNAME || "HRIDOY BOT";

  api.sendMessage(
    "╔════════════════════╗\n" +
    "   🔴 BOT SHUTDOWN 🔴\n" +
    "╚════════════════════╝\n\n" +
    `💠 ${botName}\n` +
    "✅ বট বন্ধ করার অনুরোধ গ্রহণ করা হয়েছে।\n" +
    "👑 OWNER: হৃদয় হাসান শান্ত",
    event.threadID,
    () => process.exit(0),
    event.messageID
  );
};
