const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");
const path = require("path");
const os = require("os");

module.exports = {
  config: {
    name: "catbox2",
    aliases: ["up", "upload", "cb"],
    version: "2.0.0",
    author: "হৃদয় হাসান শান্ত",
    countDown: 5,
    role: 0,

    shortDescription: {
      en: "Upload media and get direct link"
    },

    longDescription: {
      en: "Upload image, video, audio or GIF and get a direct link"
    },

    category: "tools",

    guide: {
      en: "{pn} reply to an image, video, audio or GIF"
    }
  },

  onStart: async function ({ event, message, api }) {
    let tempPath = null;
    let loadingMsg = null;

    try {
      // ==============================
      // CHECK REPLIED ATTACHMENT
      // ==============================

      const reply = event.messageReply;

      if (
        !reply ||
        !reply.attachments ||
        !reply.attachments.length
      ) {
        return message.reply(
          "⚠️ | Please reply to an image, video, audio or GIF."
        );
      }

      const attachment = reply.attachments[0];

      if (!attachment.url) {
        return message.reply(
          "❌ | Attachment URL পাওয়া যায়নি।"
        );
      }

      // ==============================
      // UPLOAD REACTION
      // ==============================

      api.setMessageReaction(
        "📤",
        event.messageID,
        () => {},
        true
      );

      loadingMsg = await message.reply(
        "⏳ | Uploading your file...\n\n📤 Please wait..."
      );

      // ==============================
      // FILE EXTENSION
      // ==============================

      let ext = ".jpg";

      switch (attachment.type) {
        case "video":
          ext = ".mp4";
          break;

        case "audio":
          ext = ".mp3";
          break;

        case "animated_image":
          ext = ".gif";
          break;

        case "photo":
        case "image":
          ext = ".jpg";
          break;

        default:
          ext = ".bin";
      }

      // ==============================
      // TEMP FILE
      // ==============================

      tempPath = path.join(
        os.tmpdir(),
        `catbox_${Date.now()}${ext}`
      );

      // ==============================
      // DOWNLOAD ATTACHMENT
      // ==============================

      const response = await axios.get(
        attachment.url,
        {
          responseType: "stream",
          timeout: 60000
        }
      );

      const writer = fs.createWriteStream(tempPath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      if (!fs.existsSync(tempPath)) {
        throw new Error("Temporary file তৈরি করা যায়নি।");
      }

      let finalLink = null;

      // ==================================================
      // 1️⃣ CATBOX
      // ==================================================

      try {
        const form = new FormData();

        form.append("reqtype", "fileupload");

        form.append(
          "fileToUpload",
          fs.createReadStream(tempPath)
        );

        const upload = await axios.post(
          "https://catbox.moe/user/api.php",
          form,
          {
            headers: form.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            timeout: 120000
          }
        );

        const link = String(upload.data || "").trim();

        if (link.startsWith("https://")) {
          finalLink = link;
        }
      } catch (error) {
        console.log(
          "⚠️ Catbox failed:",
          error.message
        );
      }

      // ==================================================
      // 2️⃣ TMPFILES FALLBACK
      // ==================================================

      if (!finalLink) {
        try {
          const form = new FormData();

          form.append(
            "file",
            fs.createReadStream(tempPath)
          );

          const upload = await axios.post(
            "https://tmpfiles.org/api/v1/upload",
            form,
            {
              headers: form.getHeaders(),
              maxBodyLength: Infinity,
              maxContentLength: Infinity,
              timeout: 120000
            }
          );

          const raw =
            upload.data?.data?.url;

          if (raw) {
            finalLink = raw.replace(
              "https://tmpfiles.org/",
              "https://tmpfiles.org/dl/"
            );
          }
        } catch (error) {
          console.log(
            "⚠️ Tmpfiles failed:",
            error.message
          );
        }
      }

      // ==================================================
      // 3️⃣ 0X0.ST FALLBACK
      // ==================================================

      if (!finalLink) {
        try {
          const form = new FormData();

          form.append(
            "file",
            fs.createReadStream(tempPath)
          );

          const upload = await axios.post(
            "https://0x0.st",
            form,
            {
              headers: form.getHeaders(),
              maxBodyLength: Infinity,
              maxContentLength: Infinity,
              timeout: 120000
            }
          );

          const link =
            String(upload.data || "").trim();

          if (link.startsWith("http")) {
            finalLink = link;
          }
        } catch (error) {
          console.log(
            "⚠️ 0x0.st failed:",
            error.message
          );
        }
      }

      // ==============================
      // ALL SERVER FAILED
      // ==============================

      if (!finalLink) {
        throw new Error(
          "সব upload server ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।"
        );
      }

      // ==============================
      // DELETE LOADING MESSAGE
      // ==============================

      if (loadingMsg?.messageID) {
        try {
          await api.unsendMessage(
            loadingMsg.messageID
          );
        } catch {}
      }

      // ==============================
      // SUCCESS REACTION
      // ==============================

      api.setMessageReaction(
        "✅",
        event.messageID,
        () => {},
        true
      );

      // ==============================
      // SUCCESS MESSAGE
      // ==============================

      return message.reply(
        `╭───────────────╮
   📤 UPLOAD SUCCESS
╰───────────────╯

📁 Type: ${attachment.type || "media"}

🔗 Direct Link:
${finalLink}

✅ Uploaded Successfully`
      );

    } catch (err) {

      console.error(
        "CATBOX ERROR:",
        err
      );

      // ==============================
      // REMOVE LOADING MESSAGE
      // ==============================

      if (loadingMsg?.messageID) {
        try {
          await api.unsendMessage(
            loadingMsg.messageID
          );
        } catch {}
      }

      // ==============================
      // ERROR REACTION
      // ==============================

      try {
        api.setMessageReaction(
          "❌",
          event.messageID,
          () => {},
          true
        );
      } catch {}

      return message.reply(
        `╭───────────────╮
   ❌ UPLOAD FAILED
╰───────────────╯

⚠️ ${err.message || "Unknown error"}

🔄 Please try again.`
      );

    } finally {

      // ==============================
      // CLEAN TEMP FILE
      // ==============================

      try {
        if (
          tempPath &&
          fs.existsSync(tempPath)
        ) {
          await fs.remove(tempPath);
        }
      } catch (error) {
        console.log(
          "Temp cleanup failed:",
          error.message
        );
      }
    }
  }
};

Install dependencies:

npm install axios fs-extra form-data

ব্যবহার:

catbox

তারপর কোনো ছবি / ভিডিও / অডিও / GIF-এর মেসেজে Reply করে কমান্ড দেবে।
