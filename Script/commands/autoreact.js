/**
 * ╔══════════════════════════════════════════════╗
 * ║            🤖 AUTO REACT BOT v3.0           ║
 * ║          💠 HRIDOY HASAN SHANTO 💠          ║
 * ╚══════════════════════════════════════════════╝
 *
 * Compatible:
 * ✅ GoatBot / FCA style
 * ✅ Mirai-style command loader
 *
 * Features:
 * ✅ autoreact on
 * ✅ autoreact off
 * ✅ autoreact toggle
 * ✅ JSON thread storage
 * ✅ Random reactions
 * ✅ Duplicate protection
 * ✅ Bot/self message protection
 * ✅ Detailed error logs
 */

const fs = require("fs-extra");
const path = require("path");

// =====================================================
// ⚙️ CONFIG
// =====================================================

module.exports.config = {
  name: "autoreact",
  version: "3.0.0",
  hasPermission: 0,
  credits: "HRIDOY HASAN SHANTO",
  description: "Automatically reacts to new messages",
  commandCategory: "No Prefix",
  cooldowns: 0,
  usages: "autoreact on/off/toggle"
};

// =====================================================
// 📁 JSON DATABASE
// =====================================================

const DB_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DB_DIR, "autoreact.json");

try {
  fs.ensureDirSync(DB_DIR);

  if (!fs.existsSync(DB_FILE)) {
    fs.writeJsonSync(DB_FILE, {}, { spaces: 2 });
  }
} catch (error) {
  console.error(
    `[AUTOREACT] Database initialization failed:\n${error.stack || error}`
  );
}

// =====================================================
// 🧠 MEMORY / CACHE
// =====================================================

const processedMessages = new Set();
const reactingMessages = new Set();

// Keep memory from growing forever
function cleanupSet(set, value) {
  setTimeout(() => {
    set.delete(value);
  }, 30000);
}

// =====================================================
// 📖 DATABASE HELPERS
// =====================================================

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeJsonSync(DB_FILE, {}, { spaces: 2 });
    }

    return fs.readJsonSync(DB_FILE);
  } catch (error) {
    console.error(
      `[AUTOREACT] JSON READ ERROR:\n${error.stack || error}`
    );

    return {};
  }
}

function writeDB(data) {
  try {
    fs.writeJsonSync(DB_FILE, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(
      `[AUTOREACT] JSON WRITE ERROR:\n${error.stack || error}`
    );

    return false;
  }
}

function getStatus(threadID) {
  const db = readDB();

  return db[String(threadID)] === true;
}

function setStatus(threadID, status) {
  const db = readDB();

  db[String(threadID)] = Boolean(status);

  return writeDB(db);
}

// =====================================================
// 😍 REACTION LIST
// =====================================================

const emojis = [
  "😀", "😃", "😄", "😁", "😆", "😂", "🤣",
  "😊", "😇", "🙂", "😉", "😌", "😍", "🥰",
  "😘", "😗", "😙", "😚", "😋", "😛", "😝",
  "😜", "🤪", "🤓", "😎", "🤩", "🥳", "😏",
  "😒", "😞", "😔", "😟", "😕", "🙁", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤",
  "😠", "😡", "🤬", "🤯", "😳", "😱", "🤗",
  "🤭", "🤫", "🤔", "🤐", "😐", "😑", "😶",
  "🙄", "😬", "😮", "😯", "😲", "😴", "🤤",
  "🥴", "🤢", "🤮", "🤧", "😷", "🤠", "🥸",
  "😈", "👿", "🤡", "👻", "💀", "👽", "🤖",

  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤",
  "🤍", "🤎", "🩷", "🩵", "🩶", "💔", "💕",
  "💞", "💓", "💗", "💖", "💘", "💝", "💟",
  "💯", "💫", "✨", "⭐", "🌟", "🔥", "💥",
  "⚡", "🌈",

  "🌸", "🌺", "🌻", "🌹", "🌷", "🌼", "💐",
  "🍀", "🌿", "🍁", "🍂", "🍃", "🌱",

  "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘",
  "🤙", "👋", "👏", "🙌", "👐", "🤲", "🙏",
  "💪", "🫶", "🫰", "🤌", "💅", "👀",

  "🎉", "🎊", "🎈", "🎁", "🎂", "🎀", "🎵",
  "🎶", "🎸", "🎹", "🎧", "🎤", "🎬", "🎮",
  "🏆", "🥇", "🚀",

  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻",
  "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸",
  "🐵", "🙈", "🙉", "🙊", "🐔", "🐧", "🐦",
  "🦋", "🐝", "🦄", "🐴", "🐢", "🐍", "🐳",
  "🐬", "🐟", "🐠", "🐙"
];

function randomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// =====================================================
// 🛡️ SELF/BOT MESSAGE DETECTION
// =====================================================

function isBotMessage(api, event) {
  try {
    if (!event) return true;

    // FCA/Mirai event flag
    if (
      event.senderID &&
      api?.getCurrentUserID &&
      String(event.senderID) === String(api.getCurrentUserID())
    ) {
      return true;
    }

    // Some loaders provide this
    if (event.isBot === true) return true;

    // Prevent reacting to our own command/reply
    if (
      event.senderID &&
      global.botID &&
      String(event.senderID) === String(global.botID)
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(
      `[AUTOREACT] BOT CHECK ERROR:\n${error.stack || error}`
    );

    return false;
  }
}

// =====================================================
// 🚫 COMMAND MESSAGE DETECTION
// =====================================================

function isAutoReactCommand(event) {
  const body = String(event?.body || "")
    .trim()
    .toLowerCase();

  return /^autoreact(\s+|$)/i.test(body);
}

// =====================================================
// ⚡ SEND REACTION
// =====================================================

async function reactToMessage(api, event) {
  const threadID = String(event.threadID);
  const messageID = String(event.messageID);

  const uniqueID = `${threadID}:${messageID}`;

  // Duplicate protection
  if (processedMessages.has(uniqueID)) {
    return;
  }

  if (reactingMessages.has(uniqueID)) {
    return;
  }

  processedMessages.add(uniqueID);
  reactingMessages.add(uniqueID);

  cleanupSet(processedMessages, uniqueID);
  cleanupSet(reactingMessages, uniqueID);

  const reaction = randomEmoji();

  try {
    if (typeof api.setMessageReaction !== "function") {
      console.error(
        "[AUTOREACT] ERROR: api.setMessageReaction() is not available."
      );

      reactingMessages.delete(uniqueID);
      return;
    }

    /*
     * FCA signature:
     * api.setMessageReaction(reaction, messageID, callback, force)
     */

    api.setMessageReaction(
      reaction,
      messageID,
      (error) => {
        reactingMessages.delete(uniqueID);

        if (error) {
          console.error(
            `[AUTOREACT] REACTION FAILED
Thread: ${threadID}
Message: ${messageID}
Reaction: ${reaction}
Error: ${error.message || error}`
          );
          return;
        }

        console.log(
          `[AUTOREACT] Reacted ${reaction} | Thread: ${threadID} | Message: ${messageID}`
        );
      },
      true
    );
  } catch (error) {
    reactingMessages.delete(uniqueID);

    console.error(
      `[AUTOREACT] REACTION EXCEPTION
Thread: ${threadID}
Message: ${messageID}
Error: ${error.stack || error}`
    );
  }
}

// =====================================================
// 📩 EVENT HANDLER
// =====================================================

module.exports.handleEvent = async ({ api, event }) => {
  try {
    if (!event) return;

    if (!event.threadID) return;
    if (!event.messageID) return;

    // Ignore own/bot messages
    if (isBotMessage(api, event)) return;

    // Ignore autoreact command itself
    if (isAutoReactCommand(event)) return;

    const threadID = String(event.threadID);

    // Check JSON storage
    if (!getStatus(threadID)) {
      return;
    }

    await reactToMessage(api, event);

  } catch (error) {
    console.error(
      `[AUTOREACT] EVENT ERROR:\n${error.stack || error}`
    );
  }
};

// =====================================================
// 🎛️ COMMAND
// =====================================================

module.exports.run = async ({ api, event }) => {
  try {
    if (!event || !event.threadID) {
      return;
    }

    const threadID = String(event.threadID);
    const messageID = event.messageID;

    const body = String(event.body || "").trim();

    const args = body
      .split(/\s+/)
      .slice(1);

    const action = String(args[0] || "toggle").toLowerCase();

    let status;

    // =================================================
    // 🟢 ON
    // =================================================

    if (action === "on") {
      status = true;
    }

    // =================================================
    // 🔴 OFF
    // =================================================

    else if (action === "off") {
      status = false;
    }

    // =================================================
    // 🔄 TOGGLE
    // =================================================

    else if (action === "toggle") {
      status = !getStatus(threadID);
    }

    // =================================================
    // ❌ INVALID
    // =================================================

    else {
      return api.sendMessage(
        "╭───────────────╮\n" +
        "│ 🤖 AUTO REACT │\n" +
        "├───────────────┤\n" +
        "│ ❌ ভুল ব্যবহার!\n" +
        "│\n" +
        "│ 🟢 autoreact on\n" +
        "│ 🔴 autoreact off\n" +
        "│ 🔄 autoreact toggle\n" +
        "╰───────────────╯",
        threadID,
        messageID
      );
    }

    // =================================================
    // 💾 SAVE
    // =================================================

    const saved = setStatus(threadID, status);

    if (!saved) {
      return api.sendMessage(
        "❌ Auto-react status save করা যায়নি!\n\n" +
        "⚠️ Console log চেক করুন।",
        threadID,
        messageID
      );
    }

    // =================================================
    // 📤 RESPONSE
    // =================================================

    if (status) {
      return api.sendMessage(
        "╭────────────────╮\n" +
        "│ 🤖 AUTO REACT  │\n" +
        "├────────────────┤\n" +
        "│ 🟢 Status: ON  │\n" +
        "│ 💫 Random React Active\n" +
        "│ 🛡️ Duplicate Protection: ON\n" +
        "│ 💾 JSON Storage: ON\n" +
        "╰────────────────╯",
        threadID,
        messageID
      );
    }

    return api.sendMessage(
      "╭────────────────╮\n" +
      "│ 🤖 AUTO REACT  │\n" +
      "├────────────────┤\n" +
      "│ 🔴 Status: OFF │\n" +
      "│ 🛑 Auto React Disabled\n" +
      "╰────────────────╯",
      threadID,
      messageID
    );

  } catch (error) {
    console.error(
      `[AUTOREACT] COMMAND ERROR:\n${error.stack || error}`
    );

    try {
      return api.sendMessage(
        "❌ Auto-react চালু/বন্ধ করতে সমস্যা হয়েছে!\n\n" +
        "🔴 Error: " +
        (error.message || error),
        event.threadID,
        event.messageID
      );
    } catch (sendError) {
      console.error(
        `[AUTOREACT] ERROR MESSAGE SEND FAILED:\n${sendError.stack || sendError}`
      );
    }
  }
};
