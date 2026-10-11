
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "helpall",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "💗 HRIDOY HASAN SHANTO 💗",
  description: "🎀 মেয়েরাই বট Premium Help Menu",
  commandCategory: "System",
  usages: "[No args]",
  cooldowns: 5
};

const BOT_NAME = "মেয়েরাই বট";
const OWNER = "HRIDOY HASAN SHANTO";
const IMAGE_URL = "https://i.imgur.com/rNQJ9OA.jpeg";
const DEFAULT_PREFIX = "!";

// ✨ Stylish Font
function fancy(text) {
  const map = {
    A:"𝘼",B:"𝘽",C:"𝘾",D:"𝘿",E:"𝙀",F:"𝙁",
    G:"𝙂",H:"𝙃",I:"𝙄",J:"𝙅",K:"𝙆",L:"𝙇",
    M:"𝙈",N:"𝙉",O:"𝙊",P:"𝙋",Q:"𝙌",R:"𝙍",
    S:"𝙎",T:"𝙏",U:"𝙐",V:"𝙑",W:"𝙒",X:"𝙓",
    Y:"𝙔",Z:"𝙕",
    a:"𝙖",b:"𝙗",c:"𝙘",d:"𝙙",e:"𝙚",f:"𝙛",
    g:"𝙜",h:"𝙝",i:"𝙞",j:"𝙟",k:"𝙠",l:"𝙡",
    m:"𝙢",n:"𝙣",o:"𝙤",p:"𝙥",q:"𝙦",r:"𝙧",
    s:"𝙨",t:"𝙩",u:"𝙪",v:"𝙫",w:"𝙬",x:"𝙭",
    y:"𝙮",z:"𝙯",
    "0":"𝟬","1":"𝟭","2":"𝟮","3":"𝟯","4":"𝟰",
    "5":"𝟱","6":"𝟲","7":"𝟳","8":"𝟴","9":"𝟵"
  };

  return String(text).split("").map(c => map[c] || c).join("");
}

// ⚙️ Prefix
function getPrefix(threadID) {
  try {
    const data = global.data?.threadData;
    const settings = data
      ? data.get(parseInt(threadID)) || {}
      : {};

    return settings.PREFIX || global.config?.PREFIX || DEFAULT_PREFIX;
  } catch {
    return DEFAULT_PREFIX;
  }
}

// 🖼️ Download image
async function downloadImage(filePath) {
  await fs.ensureDir(path.dirname(filePath));

  const response = await axios.get(IMAGE_URL, {
    responseType: "arraybuffer",
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  await fs.writeFile(filePath, response.data);
}

// 💌 Send Help Menu
async function sendHelp(api, event) {
  const { threadID, messageID } = event;
  const commands = global.client?.commands;

  if (!commands) {
    return api.sendMessage(
      "🥺 বটের কমান্ড লিস্ট পাওয়া যায়নি!",
      threadID,
      messageID
    );
  }

  const prefix = getPrefix(threadID);
  const allCommands = [...commands.keys()]
    .filter(cmd => typeof cmd === "string" && cmd.trim())
    .map(cmd => cmd.trim())
    .sort((a, b) => a.localeCompare(b));

  const total = allCommands.length;

  if (!total) {
    return api.sendMessage(
      "🌸 এখনো কোনো কমান্ড পাওয়া যায়নি!",
      threadID,
      messageID
    );
  }

  const commandList = allCommands.map((cmd, i) => {
    return `┃ 💗 ${fancy(i + 1)}. ${fancy(cmd)}`;
  }).join("\n");

  const text = `
╭━━━〔 🎀 ${BOT_NAME} 🎀 〕━━━╮
┃
┃      💕 ${fancy("WELCOME")} 💕
┃
┃  🌷 𝐁𝐎𝐓 : ${BOT_NAME}
┃  👑 𝐎𝐖𝐍𝐄𝐑 : ${OWNER}
┃  🟢 𝐒𝐓𝐀𝐓𝐔𝐒 : ${fancy("ONLINE")}
┃  📚 𝐓𝐎𝐓𝐀𝐋 : ${fancy(total)} Commands
┃  ⚙️ 𝐏𝐑𝐄𝐅𝐈𝐗 : ${fancy(prefix)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🌸 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🌸 〕━━━╮
${commandList}
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 💌 𝐇𝐎𝐖 𝐓𝐎 𝐔𝐒𝐄 💌 〕━━━╮
┃ 🎀 ${prefix}helpall
┃ 🦋 ${prefix}allcmd
┃ 🌹 ${prefix}help command
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 💖 𝐂𝐑𝐄𝐃𝐈𝐓𝐒 💖 〕━━━╮
┃ ✨ Developer: ${OWNER}
┃ 🌷 Made with love
┃ 🎀 Thanks for using ${BOT_NAME}
╰━━━━━━━━━━━━━━━━━━━━━━╯

       💗 𝑺𝑻𝑨𝒀 𝑪𝑼𝑻𝑬 💗
`;

  const imgPath = path.join(__dirname, "cache", "helpallbg.jpg");

  try {
    await downloadImage(imgPath);

    return api.sendMessage({
      body: text,
      attachment: fs.createReadStream(imgPath)
    }, threadID, err => {
      if (err) console.error("[HELPALL]", err);
      fs.unlink(imgPath).catch(() => {});
    }, messageID);
  } catch (error) {
    console.error("[HELPALL IMAGE]", error.message);
    return api.sendMessage(text, threadID, messageID);
  }
}

// 🔥 Prefix command
module.exports.run = async function ({ api, event }) {
  return sendHelp(api, event);
};

// 💬 No-prefix trigger
module.exports.handleEvent = async function ({ api, event }) {
  const msg = (event.body || "").trim().toLowerCase();

  if (msg === "helpall" || msg === "allcmd") {
    return sendHelp(api, event);
  }
};
