/**
 * ╔══════════════════════════════════════════════╗
 * ║          💠 HRIDOY ADMIN SYSTEM V2           ║
 * ║           HRIDOY HASAN SHANTO                ║
 * ╚══════════════════════════════════════════════╝
 */

const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "0admin",
  version: "2.0.0",
  hasPermssion: 3,
  credits: "হৃদয় হাসান শান্ত",
  description: "Advanced Admin Configuration",
  commandCategory: "Admin",
  usages: "0admin [list/add/remove/addndh/removendh/only/ndhonly/ibonly/qtvonly]",
  cooldowns: 2,
  dependencies: {
    "fs-extra": ""
  }
};

const DATA_DIR = path.join(__dirname, "cache");
const DATA_FILE = path.join(DATA_DIR, "data.json");

function ensureData() {
  fs.ensureDirSync(DATA_DIR);

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeJsonSync(DATA_FILE, { adminbox: {} }, { spaces: 2 });
  }

  const data = fs.readJsonSync(DATA_FILE, { throws: false }) || {};
  if (!data.adminbox || typeof data.adminbox !== "object") {
    data.adminbox = {};
  }

  fs.writeJsonSync(DATA_FILE, data, { spaces: 2 });
  return data;
}

module.exports.onLoad = function () {
  ensureData();
};

module.exports.languages = {
  en: {
    listAdmin: "💠 HRIDOY ADMIN SYSTEM\n\n👑 ADMIN LIST\n%1\n\n🤖 SUPPORT LIST\n%2",
    notHavePermssion: "⛔ You don't have permission to use: %1",
    addedNewAdmin: "✅ Added %1 admin(s)\n\n%2",
    removedAdmin: "✅ Removed %1 admin(s)\n\n%2",
    addedNewNDH: "✅ Added %1 support member(s)\n\n%2",
    removedNDH: "✅ Removed %1 support member(s)\n\n%2"
  }
};

module.exports.run = async function ({
  api, event, args, Users, permssion, getText
}) {
  const { threadID, messageID, mentions } = event;
  const configPath = global.client.configPath;
  const config = require(configPath);

  if (!Array.isArray(config.ADMINBOT)) config.ADMINBOT = [];
  if (!Array.isArray(config.NDH)) config.NDH = [];

  const admins = config.ADMINBOT;
  const supports = config.NDH;
  const mentionIDs = Object.keys(mentions || {});

  function saveConfig() {
    fs.writeJsonSync(configPath, config, { spaces: 2 });
    delete require.cache[require.resolve(configPath)];
  }

  function send(body) {
    return api.sendMessage(body, threadID, messageID);
  }

  function isOwner() {
    return Number(permssion) >= 3;
  }

  function getTargetIDs() {
    if (event.type === "message_reply" && event.messageReply) {
      return [String(event.messageReply.senderID)];
    }

    if (mentionIDs.length) {
      return mentionIDs.map(String);
    }

    const id = args[1];
    return id && /^\d+$/.test(id) ? [id] : [];
  }

  function uniquePush(list, id) {
    if (!list.includes(id)) list.push(id);
  }

  async function formatUsers(ids) {
    const output = [];

    for (const id of ids) {
      let name = id;

      try {
        const user = await Users.getData(id);
        if (user && user.name) name = user.name;
      } catch (_) {}

      output.push(`👤 ${name}\n🆔 ${id}\n🔗 https://www.facebook.com/${id}`);
    }

    return output.join("\n\n");
  }

  const action = String(args[0] || "").toLowerCase();

  if (!action) {
    return send(
`╭━━━〔 💠 HRIDOY ADMIN V2 〕━━━╮
┃
┃ 👑 ${global.config.PREFIX}0admin list
┃ ➕ ${global.config.PREFIX}0admin add @mention
┃ ➖ ${global.config.PREFIX}0admin remove @mention
┃ 🤖 ${global.config.PREFIX}0admin addndh @mention
┃ ❌ ${global.config.PREFIX}0admin removendh @mention
┃ 🔐 ${global.config.PREFIX}0admin only
┃ 🛡️ ${global.config.PREFIX}0admin ndhonly
┃ 💬 ${global.config.PREFIX}0admin ibonly
┃ 👥 ${global.config.PREFIX}0admin qtvonly
┃
╰━━━━━━━━━━━━━━━━━━━━╯
💠 OWNER: হৃদয় হাসান শান্ত

📌 Add/Remove করতে ইউজারকে Mention
অথবা তার মেসেজে Reply দিয়ে কমান্ড দাও।`
    );
  }

  switch (action) {
    case "list":
    case "all":
    case "-a": {
      const adminText = await formatUsers(admins);
      const supportText = await formatUsers(supports);

      return send(
        `╭━━━〔 👑 ADMIN LIST 〕━━━╮\n\n` +
        `${adminText || "কোনো Admin নেই"}\n\n` +
        `╭━━━〔 🤖 SUPPORT LIST 〕━━━╮\n\n` +
        `${supportText || "কোনো Support নেই"}\n\n` +
        `💠 HRIDOY HASAN SHANTO`
      );
    }

    case "add":
    case "addndh":
    case "remove":
    case "rm":
    case "delete":
    case "removendh": {
      if (!isOwner()) {
        return send("⛔ এই কমান্ড ব্যবহারের অনুমতি শুধু Owner-এর আছে।");
      }

      const ids = getTargetIDs();
      if (!ids.length) {
        return send(
          `⚠️ ইউজার Mention বা Reply করো।\n\n` +
          `উদাহরণ: ${global.config.PREFIX}0admin add @user`
        );
      }

      let targetList;
      let title;
      let removing = false;

      if (action === "add") {
        targetList = admins;
        title = "👑 ADMIN";
      } else if (action === "addndh") {
        targetList = supports;
        title = "🤖 SUPPORT";
      } else if (action === "removendh") {
        targetList = supports;
        title = "🤖 SUPPORT";
        removing = true;
      } else {
        targetList = admins;
        title = "👑 ADMIN";
        removing = true;
      }

      const changed = [];

      for (const id of ids) {
        const index = targetList.indexOf(id);

        if (removing) {
          if (index !== -1) {
            targetList.splice(index, 1);
            changed.push(id);
          }
        } else if (!targetList.includes(id)) {
          targetList.push(id);
          changed.push(id);
        }
      }

      saveConfig();

      const names = await formatUsers(changed);

      return send(
        `${removing ? "✅ ROLE REMOVED" : "✅ ROLE UPDATED"}\n` +
        `╭━━━━━━━━━━━━━━━━━━╮\n` +
        `┃ ${title}\n` +
        `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
        `${names || "কোনো পরিবর্তন করা হয়নি।"}\n\n` +
        `💠 HRIDOY HASAN SHANTO`
      );
    }

    case "only":
    case "-o": {
      if (!isOwner()) {
        return send("⛔ শুধু Owner এই Mode পরিবর্তন করতে পারবে।");
      }

      config.adminOnly = config.adminOnly !== true;
      saveConfig();

      return send(
        `👑 ADMIN ONLY MODE\n\n` +
        `Status: ${config.adminOnly ? "✅ ENABLED" : "❌ DISABLED"}\n\n` +
        `${config.adminOnly
          ? "শুধু Admin-দের ব্যবহারের জন্য Mode চালু করা হয়েছে।"
          : "Admin Only Mode বন্ধ করা হয়েছে।"}`
      );
    }

    case "ndhonly":
    case "-ndh": {
      if (!isOwner()) {
        return send("⛔ শুধু Owner এই Mode পরিবর্তন করতে পারবে।");
      }

      config.ndhOnly = config.ndhOnly !== true;
      saveConfig();

      return send(
        `🤖 SUPPORT ONLY MODE\n\n` +
        `Status: ${config.ndhOnly ? "✅ ENABLED" : "❌ DISABLED"}\n\n` +
        `💠 HRIDOY HASAN SHANTO`
      );
    }

    case "ibonly": {
      if (!isOwner()) {
        return send("⛔ শুধু Owner এই Mode পরিবর্তন করতে পারবে।");
      }

      config.adminPaOnly = config.adminPaOnly !== true;
      saveConfig();

      return send(
        `💬 INBOX ONLY MODE\n\n` +
        `Status: ${config.adminPaOnly ? "✅ ENABLED" : "❌ DISABLED"}\n\n` +
        `💠 HRIDOY HASAN SHANTO`
      );
    }

    case "qtvonly": {
      if (Number(permssion) < 1) {
        return send("⛔ এই Mode পরিবর্তনের অনুমতি নেই।");
      }

      const database = ensureData();
      database.adminbox[threadID] =
        database.adminbox[threadID] !== true;

      fs.writeJsonSync(DATA_FILE, database, { spaces: 2 });

      return send(
        `👥 GROUP ADMIN ONLY MODE\n\n` +
        `Status: ${database.adminbox[threadID] ? "✅ ENABLED" : "❌ DISABLED"}\n\n` +
        `💠 HRIDOY HASAN SHANTO`
      );
    }

    default:
      return send(
        `❌ Unknown command: ${action}\n\n` +
        `📌 ${global.config.PREFIX}0admin\n` +
        `দিয়ে Help Menu দেখো।`
      );
  }
};
