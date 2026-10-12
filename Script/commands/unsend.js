module.exports.config = {
  name: "unsend",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Unsend bot messages",
  commandCategory: "System",
  usages: "Reply to a bot message with unsend",
  cooldowns: 0
};

module.exports.languages = {
  vi: {
    returnCant: "Không thể gỡ tin nhắn của người khác.",
    missingReply: "Hãy reply tin nhắn cần gỡ."
  },
  en: {
    returnCant:
      "😿 শুধু বটের পাঠানো মেসেজ Unsend করা যাবে!",
    missingReply:
      "💌 যে মেসেজটি Unsend করতে চাও, সেটিতে Reply করে .unsend লেখো।"
  }
};

module.exports.run = function ({ api, event, getText }) {
  const { threadID, messageID, type, messageReply } = event;

  if (type !== "message_reply" || !messageReply) {
    return api.sendMessage(
      getText("missingReply"),
      threadID,
      messageID
    );
  }

  if (String(messageReply.senderID) !==
      String(api.getCurrentUserID())) {
    return api.sendMessage(
      getText("returnCant"),
      threadID,
      messageID
    );
  }

  return api.unsendMessage(messageReply.messageID, err => {
    if (err) {
      return api.sendMessage(
        "❌ মেসেজ Unsend করা যায়নি!",
        threadID,
        messageID
      );
    }
  });
};
