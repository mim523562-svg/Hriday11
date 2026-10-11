const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Xrahat -gen API-এর base URL
const API_BASE = "https://xrahat-gen.vercel.app";
const GENERATE_ENDPOINT = `${API_BASE}/api/generate`;

module.exports.config = {
  name: "gen", 
  version: "1.0.0",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",  
  description: "ছবিতে রিপ্লাই দিয়ে prompt লিখে AI ভিডিও generate করে",
  commandCategory: "AI",
  usages: "[একটা ছবিতে reply দিয়ে] gen <prompt>",
  cooldowns: 10
};

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  if (!messageReply || !Array.isArray(messageReply.attachments) || messageReply.attachments.length === 0) {
    return api.sendMessage(
      "⚠️ একটা ছবিতে reply দিয়ে লিখুন: gen <prompt>\nExample: gen dancing in a neon city",
      threadID,
      messageID
    );
  }

  const attachment = messageReply.attachments.find(
    (a) => a.type === "photo" || a.type === "sticker" || a.type === "animated_image"
  );

  if (!attachment || !(attachment.url || attachment.previewUrl || attachment.largePreviewUrl)) {
    return api.sendMessage("⚠️ শুধু ছবিতে reply দিয়ে এই command ব্যবহার করা যাবে।", threadID, messageID);
  }

  const prompt = (args || []).join(" ").trim();
  if (!prompt) {
    return api.sendMessage("⚠️ Prompt লিখুন। Example: gen dancing in a neon city", threadID, messageID);
  }

  const imageUrl = attachment.url || attachment.previewUrl || attachment.largePreviewUrl;
  let waitMessageID = null;
  let tempFilePath = null;

  try {
    
    waitMessageID = await new Promise((resolve) => {
      api.sendMessage("🪒please wait bara...", threadID, (err, info) => {
        resolve(info ? info.messageID : null);
      }, messageID);
    });

    // ২) ছবি download
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 670000
    });
    const imageBuffer = Buffer.from(imageResponse.data);
 const form = new FormData();
    form.append("image", imageBuffer, { filename: "input.jpg", contentType: "image/jpeg" });
    form.append("prompt", prompt);
    form.append("mode", "image");

    const genResponse = await axios.post(GENERATE_ENDPOINT, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 2780000,
      responseType: "arraybuffer",
      validateStatus: () => true 
    });

    const contentType = genResponse.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      let errJson = null;
      try {
        errJson = JSON.parse(Buffer.from(genResponse.data).toString("utf-8"));
      } catch (_) {}
      throw new Error((errJson && errJson.Result) || "Generation failed");
    }

    if (genResponse.status < 200 || genResponse.status >= 300 || !contentType.startsWith("video/")) {
      throw new Error("Unexpected response from generate API");
    }
   const ext = (contentType.split("/")[1] || "mp4").split(";")[0].trim();
    const videoBuffer = Buffer.from(genResponse.data);
    tempFilePath = path.join(os.tmpdir(), `gen_${Date.now()}_${Math.floor(Math.random() * 1e6)}.${ext}`);
    fs.writeFileSync(tempFilePath, videoBuffer);

 await new Promise((resolve, reject) => {
      api.sendMessage(
        {
          body: "✅ আপনার ভিডিও তৈরি!",
          attachment: fs.createReadStream(tempFilePath)
        },
        threadID,
        (err) => (err ? reject(err) : resolve()),
        messageID
      );
    });
   if (waitMessageID) {
      try {
        api.unsendMessage(waitMessageID);
      } catch (_) {}
    }
  } catch (error) {
    console.error("[gen.js] error:", error?.response?.data || error.message || error);
    api.sendMessage("❌ ভিডিও তৈরি করা যায়নি, আবার চেষ্টা করুন।", threadID, messageID);
  } finally {
    // temp ফাইল সবসময় cleanup
    if (tempFilePath) {
      fs.unlink(tempFilePath, () => {});
    }
  }
};
