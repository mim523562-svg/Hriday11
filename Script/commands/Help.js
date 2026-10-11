
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Shows all commands with details",
  commandCategory: "system",
  usages: "[command name/page number]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

// 🔠 Mathematical Monospace Font Converter
function toBold(text) {
  const boldMap = {
    'A':'𝙰','B':'𝙱','C':'𝙲','D':'𝙳','E':'𝙴','F':'𝙵','G':'𝙶',
    'H':'𝙷','I':'𝙸','J':'𝙹','K':'𝙺','L':'𝙻','M':'𝙼','N':'𝙽',
    'O':'𝙾','P':'𝙿','Q':'𝚀','R':'𝚁','S':'𝚂','T':'𝚃','U':'𝚄',
    'V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈','Z':'𝚉',
    'a':'𝚊','b':'𝚋','c':'𝚌','d':'𝚍','e':'𝚎','f':'𝚏','g':'𝚐',
    'h':'𝚑','i':'𝚒','j':'𝚓','k':'𝚔','l':'𝚕','m':'𝚖','n':'𝚗',
    'o':'𝚘','p':'𝚙','q':'𝚚','r':'𝚛','s':'𝚜','t':'𝚝','u':'𝚞',
    'v':'𝚟','w':'𝚠','x':'𝚡','y':'𝚢','z':'𝚣',
    '0':'𝟶','1':'𝟷','2':'𝟸','3':'𝟹','4':'𝟺',
    '5':'𝟻','6':'𝟼','7':'𝟽','8':'𝟾','9':'𝟿'
  };

  return String(text).split('').map(ch => boldMap[ch] || ch).join('');
}

function getPrefix(threadID) {
  const threadData = global.data.threadData;
  const threadSetting = threadData
    ? threadData.get(parseInt(threadID)) || {}
    : {};

  return threadSetting.PREFIX || global.config.PREFIX || "";
}

module.exports.languages = {
  en: {
    moduleInfo: `╔══════════════════════╗
║ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨ ║
╠══════════════════════╣
║
║ 🔖 𝐍𝐚𝐦𝐞 ⇢ %1
║ 📄 𝐔𝐬𝐚𝐠𝐞 ⇢ %2
║ 📜 𝐃𝐞𝐬𝐜 ⇢ %3
║ 🔑 𝐏𝐞𝐫𝐦 ⇢ %4
║ 👨‍💻 𝐂𝐫𝐞𝐝𝐢𝐭 ⇢ %5
║ 📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 ⇢ %6
║ ⏳ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧 ⇢ %7s
║
╠══════════════════════╣
║ ⚙ 𝐏𝐫𝐞𝐟𝐢𝐱 ⇢ %8
║ 🤖 𝐁𝐨𝐭 ⇢ %9
║ 👑 𝐎𝐰𝐧𝐞𝐫 ⇢ HRIDOY HASAN SHANTO
╚══════════════════════╝`,
    helpList: "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
    user: "User",
    adminGroup: "Admin Group",
    adminBot: "Admin Bot"
  }
};

// 🖼️ তোমার দেওয়া Help Image
const helpImages = [
  "https://i.imgur.com/rNQJ9OA.jpeg"
];

function downloadImages(callback) {
  const imageUrl = helpImages[0];
  const cacheDir = path.join(__dirname, "cache");
  const filePath = path.join(cacheDir, "help_hriday.jpg");

  fs.ensureDir(cacheDir)
    .then(() => {
      request(imageUrl)
        .on("error", err => {
          console.error("[HELP IMAGE ERROR]", err.message);
          callback([]);
        })
        .pipe(fs.createWriteStream(filePath))
        .on("finish", () => callback([filePath]))
        .on("error", err => {
          console.error("[HELP FILE ERROR]", err.message);
          callback([]);
        });
    })
    .catch(err => {
      console.error("[HELP CACHE ERROR]", err.message);
      callback([]);
    });
}

function sendHelp(api, threadID, messageID, text) {
  downloadImages(files => {
    const sendData = files.length
      ? { body: text, attachment: files.map(f => fs.createReadStream(f)) }
      : { body: text };

    api.sendMessage(sendData, threadID, err => {
      if (err) console.error("[HELP SEND ERROR]", err);
      files.forEach(file => {
        fs.unlink(file, () => {});
      });
    }, messageID);
  });
}

function getCommandDetail(command, prefix, getText) {
  return getText(
    "moduleInfo",
    toBold(command.config.name || "Unknown"),
    toBold(command.config.usages || "Not Provided"),
    toBold(command.config.description || "Not Provided"),
    toBold(command.config.hasPermssion ?? command.config.hasPermission ?? 0),
    toBold(command.config.credits || "Unknown"),
    toBold(command.config.commandCategory || "Unknown"),
    toBold(command.config.cooldowns || 0),
    toBold(prefix || "no-prefix"),
    toBold(global.config.BOTNAME || "HRIDOY BOT")
  );
}

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body) return;

  const text = body.trim();
  const prefix = global.config.PREFIX || "";
  let args = null;

  if (prefix && text.toLowerCase().startsWith((prefix + "help ").toLowerCase())) {
    args = text.slice(prefix.length).trim().split(/\s+/).slice(1);
  } else if (text.toLowerCase().startsWith("help ")) {
    args = text.split(/\s+/).slice(1);
  } else {
    return;
  }

  if (!args[0]) return;

  const command = commands.get(args[0].toLowerCase());
  if (!command) return;

  const detail = getCommandDetail(command, getPrefix(threadID), getText);
  sendHelp(api, threadID, messageID, detail);
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const prefix = getPrefix(threadID);

  // 🔍 নির্দিষ্ট কমান্ডের তথ্য
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const command = commands.get(args[0].toLowerCase());
    const detailText = getCommandDetail(command, prefix, getText);

    return sendHelp(api, threadID, messageID, detailText);
  }

  // 📋 সব কমান্ডের লিস্ট
  const arrayInfo = Array.from(commands.keys())
    .filter(name => name && name.trim() !== "")
    .sort();

  const page = Math.max(parseInt(args[0]) || 1, 1);
  const numberOfOnePage = 100;
  const totalPages = Math.max(
    1,
    Math.ceil(arrayInfo.length / numberOfOnePage)
  );

  if (page > totalPages) {
    return api.sendMessage(
      `⚠️ Page ${page} নেই!\nমোট পেজ: ${totalPages}`,
      threadID,
      messageID
    );
  }

  const start = numberOfOnePage * (page - 1);
  const helpView = arrayInfo.slice(start, start + numberOfOnePage);

  const msg = helpView.map((cmdName, i) => {
    const num = toBold(String(start + i + 1).padStart(3, "0"));
    return `║ ${num} ➤ ${toBold(cmdName)}`;
  }).join("\n");

  const displayPrefix = prefix || "(no prefix)";
  const botName = global.config.BOTNAME || "HRIDOY BOT";

  const helpText = `╔══════════════════════╗
║ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜 ║
╠══════════════════════╣
║ 💠 𝐃𝐄𝐕 ⇢ HRIDOY HASAN SHANTO
║ 📄 𝐏𝐚𝐠𝐞 ⇢ ${toBold(page)}/${toBold(totalPages)}
║ 🧮 𝐓𝐨𝐭𝐚𝐥 ⇢ ${toBold(arrayInfo.length)}
║ 📦 𝐒𝐡𝐨𝐰𝐢𝐧𝐠 ⇢ ${toBold(helpView.length)}
╠══════════════════════╣
${msg}
╠══════════════════════╣
║ ⚙ 𝐏𝐫𝐞𝐟𝐢𝐱 ⇢ ${toBold(displayPrefix)}
║ 🤖 𝐁𝐨𝐭 ⇢ ${toBold(botName)}
║ 👑 𝐎𝐰𝐧𝐞𝐫 ⇢ HRIDOY HASAN SHANTO
╠══════════════════════╣
║ 💡 ${toBold("help <name>")} ⇢ 𝐃𝐞𝐭𝐚𝐢𝐥𝐬
║ 📄 ${toBold("help " + (page + 1))} ⇢ 𝐍𝐞𝐱𝐭 𝐏𝐚𝐠𝐞
╚══════════════════════╝`;

  return sendHelp(api, threadID, messageID, helpText);
};
