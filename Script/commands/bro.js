module.exports.config = {
  name: "bro",
  version: "12.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Best Friends banner with target mention and random friendship caption",
  commandCategory: "banner",
  usePrefix: true,
  usages: "[@mention | reply]",
  cooldowns: 30,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "canvas": ""
  }
};

// ====== Template settings ======
const TEMPLATE_URL = "https://i.imgur.com/kckRRWN.jpeg";
const REF_W = 1774;
const REF_H = 887;

const LEFT = { x: 452, y: 388, r: 192 };
const RIGHT = { x: 1315, y: 390, r: 190 };
// ================================

// ====== Random captions ======
const CAPTIONS = [
  {
    title: "🌸 𝐁𝐞𝐬𝐭 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 🌸",
    l1: "🤝 সব গল্পের সাথী, সব দুঃখের তাণ্ডি, চিরদিনের বন্ধু 💖",
    l2: "🫱 তুই থাকলে সবকিছুই সম্ভব ❤️",
    l3: "👑 𝐅𝐑𝐈𝐄𝐍𝐃𝐒 𝐅𝐎𝐑𝐄𝐕𝐄𝐑 🩷🌸"
  },
  {
    title: "🌸 𝐃𝐨𝐬𝐭 𝐇𝐢 𝐃𝐨𝐬𝐭 🌸",
    l1: "🤝 পথ আলাদা হলেও গন্তব্য আমাদের একই 💖",
    l2: "🫱 তোর মতো বন্ধু পাওয়া ভাগ্যের ব্যাপার ❤️",
    l3: "👑 𝐒𝐀𝐌𝐄 𝐕𝐈𝐁𝐄 𝐒𝐀𝐌𝐄 𝐌𝐈𝐍𝐃 🩷🌸"
  },
  {
    title: "🌸 𝐌𝐞𝐫𝐚 𝐘𝐚𝐚𝐫 🌸",
    l1: "🤝 ঝগড়া হোক, অভিমান হোক, বন্ধুত্বের টান কখনো কমে না 💖",
    l2: "🫱 তুই আছিস বলেই হাসতে পারি ❤️",
    l3: "👑 𝐁𝐄𝐒𝐓𝐈𝐄𝐒 𝐅𝐎𝐑 𝐋𝐈𝐅𝐄 🩷🌸"
  },
  {
    title: "🌸 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐁𝐨𝐧𝐝 🌸",
    l1: "🤝 বন্ধু মানে শুধু একটা শব্দ না, একটা পুরো পৃথিবী 💖",
    l2: "🫱 হাসি-কান্না সবকিছুতে তুই পাশে ❤️",
    l3: "👑 𝐋𝐀𝐔𝐆𝐇 𝐓𝐀𝐋𝐊 𝐒𝐔𝐏𝐏𝐎𝐑𝐓 🩷🌸"
  },
  {
    title: "🌸 𝐓𝐞𝐫𝐚 𝐃𝐨𝐬𝐭 🌸",
    l1: "🤝 ভালো বন্ধু জীবনটাকে আরও সুন্দর করে দেয় 💖",
    l2: "🫱 দূরে থাকলেও তুই সবসময় মনের কাছে ❤️",
    l3: "👑 𝐍𝐎𝐓 𝐉𝐔𝐒𝐓 𝐅𝐑𝐈𝐄𝐍𝐃𝐒 𝐁𝐔𝐓 𝐅𝐀𝐌𝐈𝐋𝐘 🩷🌸"
  },
  {
    title: "🌸 𝐘𝐚𝐚𝐫𝐢 𝐃𝐨𝐬𝐭𝐢 🌸",
    l1: "🤝 একসাথে কাটানো প্রতিটা মুহূর্ত আমার কাছে অমূল্য 💖",
    l2: "🫱 তোর সাথে সব পাগলামিই সুন্দর ❤️",
    l3: "👑 𝐁𝐄𝐒𝐓 𝐅𝐑𝐈𝐄𝐍𝐃𝐒 𝐅𝐎𝐑𝐄𝐕𝐄𝐑 🩷🌸"
  },
  {
    title: "🌸 𝐒𝐚𝐜𝐡𝐚 𝐒𝐚𝐚𝐭𝐡𝐢 🌸",
    l1: "🤝 হাত ধরলে ছাড়ব না, এই কথা দিলাম তোকে 💖",
    l2: "🫱 তুই আমার শক্তি, তুই আমার ভরসা ❤️",
    l3: "👑 𝐀𝐋𝐖𝐀𝐘𝐒 𝐓𝐎𝐆𝐄𝐓𝐇𝐄𝐑 🩷🌸"
  },
  {
    title: "🌸 𝐃𝐢𝐥 𝐊𝐚 𝐃𝐨𝐬𝐭 🌸",
    l1: "🤝 রক্তের সম্পর্ক না থাকলেও কিছু বন্ধন আপন হয়ে যায় 💖",
    l2: "🫱 তোর জন্য আমি সবসময় আছি ❤️",
    l3: "👑 𝐃𝐈𝐅𝐅𝐄𝐑𝐄𝐍𝐓 𝐏𝐀𝐓𝐇𝐒 𝐒𝐀𝐌𝐄 𝐃𝐄𝐒𝐓𝐈𝐍𝐀𝐓𝐈𝐎𝐍 🩷🌸"
  }
];

// ====== Caption UI ======
function buildBody(mentionTag, cap) {
  return (
`╔═══════════════════╗
   ✨ 𝐁𝐄𝐒𝐓 𝐅𝐑𝐈𝐄𝐍𝐃𝐒 ✨
╚═══════════════════╝

👤 ${mentionTag}

┏━━━━━━━━━━━━━━━━━━┓
   ${cap.title}
┗━━━━━━━━━━━━━━━━━━┛

${cap.l1}
${cap.l2}
${cap.l3}`
  );
}

module.exports.run = async function ({ event, api }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");
  const { createCanvas, loadImage } = require("canvas");

  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let targetID = null;
  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else if (messageReply && messageReply.senderID) {
    targetID = messageReply.senderID;
  }

  if (!targetID) {
    return api.sendMessage("Please reply or mention someone......", threadID, messageID);
  }

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  const imgPath = path.join(cacheDir, `bro_${senderID}_${targetID}.png`);
  const templatePath = path.join(cacheDir, "bro_template.jpg");

  const getTemplate = async () => {
    if (!fs.existsSync(templatePath)) {
      try {
        const res = await axios.get(TEMPLATE_URL, {
          responseType: "arraybuffer",
          timeout: 30000,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Referer": "https://imgur.com/"
          }
        });
        fs.writeFileSync(templatePath, Buffer.from(res.data));
      } catch (err) {
        throw new Error("TEMPLATE download failed: " + (err.response?.status || err.message));
      }
    }
    return loadImage(templatePath);
  };

  const getAvatar = async (uid) => {
    const url = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    try {
      const res = await axios.get(url, { responseType: "arraybuffer", timeout: 20000 });
      return loadImage(Buffer.from(res.data));
    } catch (err) {
      throw new Error("AVATAR download failed: " + (err.response?.status || err.message));
    }
  };

  try {
    const [template, avatar1, avatar2] = await Promise.all([
      getTemplate(),
      getAvatar(senderID),
      getAvatar(targetID)
    ]);

    const W = template.width;
    const H = template.height;
    const sx = W / REF_W;
    const sy = H / REF_H;
    const sr = Math.min(sx, sy);

    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(template, 0, 0, W, H);

    const drawAvatar = (img, c) => {
      const cx = c.x * sx;
      const cy = c.y * sy;
      const r = c.r * sr;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    };

    drawAvatar(avatar1, LEFT);
    drawAvatar(avatar2, RIGHT);

    fs.writeFileSync(imgPath, canvas.toBuffer("image/png"));

    // target name for mention
    let targetName = "Friend";
    try {
      const info = await api.getUserInfo(targetID);
      targetName = info[targetID]?.name || targetName;
    } catch (_) {}

    const mentionTag = `@${targetName}`;
    const cap = CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];
    const body = buildBody(mentionTag, cap);

    return api.sendMessage(
      {
        body,
        mentions: [{ tag: mentionTag, id: targetID }],
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlink(imgPath, () => {}),
      messageID
    );
  } catch (e) {
    console.log("BRO CMD ERROR:", e.response?.status, e.message);
    return api.sendMessage(
      "Error: " + (e.response?.status || e.message),
      threadID,
      messageID
    );
  }
};
