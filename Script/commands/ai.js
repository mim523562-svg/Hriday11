
const axios = require("axios");

/**
 * ╔══════════════════════════════════════╗
 * ║       🤖 HRIDOY AI BOT V2           ║
 * ║   💠 HRIDOY HASAN SHANTO 💠          ║
 * ╚══════════════════════════════════════╝
 */

module.exports = {
  config: {
    name: "ai",
    version: "2.0.0",
    credit: "💠 HRIDOY HASAN SHANTO 💠",
    author: "💠 HRIDOY HASAN SHANTO 💠",
    description: "AI Chat & Image Analysis",
    cooldowns: 3,
    hasPermssion: 0,
    commandCategory: "AI",
    usages: {
      en: "{pn} message | reply to an image"
    }
  },

  run: async function ({ api, args, event }) {
    const { threadID, messageID } = event;
    const input = args.join(" ").trim();

    const API_BASE =
      "https://apis-keith.vercel.app/ai/deepseekV3?q=";

    // Send message using old Mirai API
    const send = (message) => {
      return new Promise((resolve, reject) => {
        api.sendMessage(
          message,
          threadID,
          (err, info) => {
            if (err) return reject(err);
            resolve(info);
          },
          messageID
        );
      });
    };

    // Extract AI response
    const getResult = (data) => {
      if (typeof data === "string") {
        return data.trim() || null;
      }

      const result =
        data?.result ??
        data?.response ??
        data?.reply ??
        data?.answer ??
        data?.message;

      if (typeof result === "string" && result.trim()) {
        return result.trim();
      }

      return null;
    };

    try {
      // Empty message
      if (!input) {
        return await send(
          "╭━━━〔 🤖 HRIDOY AI 〕━━━╮\n" +
          "┃ 👋 হ্যালো! আমি HRIDOY AI\n" +
          "┃\n" +
          "┃ 💬 ব্যবহার: .ai তোমার প্রশ্ন\n" +
          "┃ 🖼️ ছবিতে Reply করে প্রশ্ন করো\n" +
          "┃\n" +
          "┃ 💠 HRIDOY HASAN SHANTO 💠\n" +
          "╰━━━━━━━━━━━━━━━━━━━━╯"
        );
      }

      // Image reply mode
      if (event.type === "message_reply") {
        const attachments =
          event.messageReply?.attachments || [];

        const image = attachments.find((item) => {
          const type = String(item.type || "").toLowerCase();
          const url = String(item.url || "");

          return (
            type === "photo" ||
            type === "image" ||
            /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url)
          );
        });

        if (!image?.url) {
          return await send(
            "🖼️ ছবির মেসেজে Reply করে প্রশ্ন করো।\n\n" +
            "উদাহরণ: .ai এই ছবিতে কী আছে?\n" +
            "💠 HRIDOY HASAN SHANTO 💠"
          );
        }

        const response = await axios.post(
          API_BASE + encodeURIComponent(input),
          { image: image.url },
          {
            timeout: 45000,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        const answer = getResult(response.data);

        if (!answer) {
          return await send(
            "😿 AI কোনো উত্তর দেয়নি। পরে আবার চেষ্টা করো।"
          );
        }

        return await send(
          "🖼️ 〔 HRIDOY AI IMAGE 〕\n\n" +
          answer +
          "\n\n💠 HRIDOY HASAN SHANTO 💠"
        );
      }

      // Normal AI chat
      const response = await axios.get(
        API_BASE + encodeURIComponent(input),
        {
          timeout: 45000,
          headers: {
            "Accept": "application/json",
            "User-Agent": "HRIDOY-AI-BOT/2.0"
          }
        }
      );

      const answer = getResult(response.data);

      if (!answer) {
        return await send(
          "😿 AI থেকে উত্তর পাওয়া যায়নি।\n" +
          "API-এর Response পরীক্ষা করো।"
        );
      }

      return await send(
        "🤖 〔 HRIDOY AI 〕\n\n" +
        answer +
        "\n\n💠 HRIDOY HASAN SHANTO 💠"
      );

    } catch (error) {
      console.error(
        "[HRIDOY AI ERROR]",
        error.response?.status || "",
        error.message
      );

      let errorMessage =
        "😿 AI বর্তমানে উত্তর দিতে পারছে না।";

      if (error.response?.status === 404) {
        errorMessage =
          "❌ AI API পাওয়া যায়নি (404)। API URL পরীক্ষা করো।";
      } else if (error.response?.status === 429) {
        errorMessage =
          "⏳ API Rate Limit হয়েছে। কিছুক্ষণ পরে চেষ্টা করো।";
      } else if (error.code === "ECONNABORTED") {
        errorMessage =
          "⏳ AI Response দিতে বেশি সময় নিচ্ছে। আবার চেষ্টা করো।";
      } else if (
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED"
      ) {
        errorMessage =
          "🌐 API Server-এর সঙ্গে সংযোগ করা যাচ্ছে না।";
      }

      try {
        return await send(
          errorMessage +
          "\n\n💠 HRIDOY HASAN SHANTO 💠"
        );
      } catch (sendError) {
        console.error(
          "[HRIDOY AI SEND ERROR]",
          sendError.message
        );
      }
    }
  }
};
