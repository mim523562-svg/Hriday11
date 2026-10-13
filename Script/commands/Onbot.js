/**
 * ╔══════════════════════════════════════════╗
 * ║         💠 HRIDOY BOT SYSTEM V2 💠       ║
 * ║       OWNER: HRIDOY HASAN SHANTO         ║
 * ╚══════════════════════════════════════════╝
 */

module.exports.config = {
  name: "onbot",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "হৃদয় হাসান শান্ত",
  description: "Bot start instructions",
  commandCategory: "System",
  usages: "onbot",
  cooldowns: 0
};

module.exports.run = ({ event, api }) => {
  const permission = ["61593296285457"];

  if (!permission.includes(String(event.senderID))) {
    return api.sendMessage(
      "⛔ অনুমতি নেই!\n" +
      "💠 শুধু বটের মালিক এই কমান্ড ব্যবহার করতে পারবেন।",
      event.threadID,
      event.messageID
    );
  }

  return api.sendMessage(
    "╔════════════════════╗\n" +
    "   🟢 HRIDOY BOT ON 🟢\n" +
    "╚════════════════════╝\n\n" +
    "💠 বট চালু করতে Hosting Panel থেকে Restart/Deploy করো।\n\n" +
    "👑 OWNER: হৃদয় হাসান শান্ত\n" +
    "💚 HRIDOY BOT SYSTEM",
    event.threadID,
    event.messageID
  );
};
