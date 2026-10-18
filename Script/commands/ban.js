/**
 * ╔══════════════════════════════════════════════╗
 * ║        💎 HRIDOY BAN SYSTEM V7 PREMIUM       ║
 * ║          🛡️ ROYAL MODERATION SYSTEM          ║
 * ║        💠 HRIDOY HASAN SHANTO 💠             ║
 * ╚══════════════════════════════════════════════╝
 */

const fs = require("fs-extra");
const path = require("path");

const BAN_FILE = path.join(__dirname, "bannedUsers.json");
const BACKUP_FILE = path.join(__dirname, "bannedUsers_backup.json");

// ================================
// GLOBAL DATA
// ================================
if (!global.data) global.data = {};
if (!(global.data.userBanned instanceof Map)) {
    global.data.userBanned = new Map();
}

// ================================
// SAFE JSON STORAGE
// ================================
function loadBan() {
    try {
        if (!fs.existsSync(BAN_FILE)) {
            fs.writeJsonSync(BAN_FILE, {}, { spaces: 2 });
            console.log("[HRIDOY BAN] New database created.");
            return;
        }

        const data = fs.readJsonSync(BAN_FILE);

        if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error("Invalid ban database format");
        }

        global.data.userBanned.clear();

        for (const [id, info] of Object.entries(data)) {
            if (/^\d+$/.test(id) && info && typeof info === "object") {
                global.data.userBanned.set(id, {
                    reason: String(info.reason || "কারণ উল্লেখ নেই"),
                    by: String(info.by || ""),
                    byName: String(info.byName || "অজানা"),
                    time: Number(info.time) || Date.now(),
                    userName: String(info.userName || "অজানা")
                });
            }
        }

        console.log(
            `[HRIDOY BAN] Loaded ${global.data.userBanned.size} banned users.`
        );
    } catch (error) {
        console.error("[HRIDOY BAN] Load error:", error.message);

        // Corrupt database is preserved; do not overwrite it automatically.
        if (!fs.existsSync(BAN_FILE)) {
            fs.writeJsonSync(BAN_FILE, {}, { spaces: 2 });
        }
    }
}

function saveBan() {
    const data = Object.fromEntries(global.data.userBanned);

    try {
        // Preserve the last known database before updating it.
        if (fs.existsSync(BAN_FILE)) {
            try {
                const oldData = fs.readJsonSync(BAN_FILE);
                if (oldData && typeof oldData === "object") {
                    fs.writeJsonSync(BACKUP_FILE, oldData, { spaces: 2 });
                }
            } catch (error) {
                console.error("[HRIDOY BAN] Backup error:", error.message);
            }
        }

        const tempFile = `${BAN_FILE}.tmp`;

        fs.writeJsonSync(tempFile, data, { spaces: 2 });
        fs.moveSync(tempFile, BAN_FILE, { overwrite: true });

        console.log(`[HRIDOY BAN] Saved ${Object.keys(data).length} users.`);
        return true;
    } catch (error) {
        console.error("[HRIDOY BAN] Save error:", error.message);
        return false;
    }
}

loadBan();

// ================================
// HELPERS
// ================================
async function getUserName(api, id, fallback = "অজানা") {
    try {
        const info = await api.getUserInfo(id);
        return info && info[id] && info[id].name
            ? info[id].name
            : fallback;
    } catch (_) {
        return fallback;
    }
}

function getTarget(event, args) {
    if (event.messageReply && event.messageReply.senderID) {
        return String(event.messageReply.senderID);
    }

    const mentions = event.mentions || {};
    const mentionIDs = Object.keys(mentions);

    if (mentionIDs.length) return String(mentionIDs[0]);

    const first = String(args[0] || "");
    return /^\d+$/.test(first) ? first : null;
}

function getReason(event, args, targetID) {
    if (event.messageReply && event.messageReply.senderID) {
        return args.join(" ").trim() || "কারণ উল্লেখ নেই";
    }

    const mentions = event.mentions || {};
    const mentionIDs = Object.keys(mentions);

    if (mentionIDs.length) {
        const mentionName = mentions[mentionIDs[0]];
        const text = args.join(" ")
            .replace(mentionName, "")
            .replace(/@\S+/g, "")
            .trim();

        return text || "কারণ উল্লেখ নেই";
    }

    if (String(args[0] || "") === targetID) {
        return args.slice(1).join(" ").trim() || "কারণ উল্লেখ নেই";
    }

    return args.join(" ").trim() || "কারণ উল্লেখ নেই";
}

function getCommand(event) {
    const first = String(event.body || "")
        .trim()
        .split(/\s+/)[0]
        .toLowerCase();

    return first.replace(/^[.!/]+/, "");
}

function getTimestamp(timestamp) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "Unknown";

    return date.toLocaleString("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function sendError(api, event, error) {
    console.error("[HRIDOY BAN]", error.message || error);

    return api.sendMessage(
        "❌ Database operation failed.\n" +
        "ডেটা সেভ হয়েছে কি না যাচাই করে আবার চেষ্টা করো।\n\n" +
        "💠 HRIDOY HASAN SHANTO 💠",
        event.threadID,
        event.messageID
    );
}

// ================================
// MODULE CONFIG
// ================================
module.exports.config = {
    name: "ban",
    version: "7.0.0",
    hasPermssion: 2,
    credits: "💠 HRIDOY HASAN SHANTO 💠",
    description: "Premium persistent ban, unban and banlist system",
    commandCategory: "group",
    usages:
        "/ban <UID/@mention> <reason>\n" +
        "/unban <UID/@mention>\n" +
        "/banlist",
    cooldowns: 3
};

// ================================
// EVENT: PREVENT BANNED USERS
// ================================
module.exports.handleEvent = async function ({ event, api }) {
    if (!event || !event.senderID || !event.threadID) return;

    const senderID = String(event.senderID);
    const banInfo = global.data.userBanned.get(senderID);

    if (!banInfo) return;

    // Avoid responding to every message from a banned user.
    // The ban is enforced by this handler's notification only.
    // This does not remove the user from Messenger groups.
    if (event.type !== "message") return;

    // Notify the banned user in the current conversation.
    return api.sendMessage(
        [
            "╭━━〔 ⛔ HRIDOY BAN SYSTEM 〕━━╮",
            "",
            `👤 User: ${banInfo.userName || "অজানা"}`,
            `🆔 UID: ${senderID}`,
            `📝 Reason: ${banInfo.reason}`,
            `👮 Banned by: ${banInfo.byName || "অজানা"}`,
            `📅 Date: ${getTimestamp(banInfo.time)}`,
            "",
            "♾️ Status: PERMANENT BAN",
            "💠 HRIDOY HASAN SHANTO 💠",
            "╰━━━━━━━━━━━━━━━━━━━━╯"
        ].join("\n"),
        event.threadID
    );
};

// ================================
// MAIN COMMAND
// ================================
module.exports.run = async function ({ event, api, args }) {
    const { threadID, messageID } = event;
    const command = getCommand(event);

    if (!["ban", "unban", "banlist"].includes(command)) {
        return api.sendMessage(
            "❌ Unknown command.\nUse /ban, /unban or /banlist.",
            threadID,
            messageID
        );
    }

    // BAN LIST
    if (command === "banlist") {
        const entries = [...global.data.userBanned.entries()];

        if (!entries.length) {
            return api.sendMessage(
                "╭━━〔 📋 BAN LIST 〕━━╮\n" +
                "┃ কোনো ব্যান করা ইউজার নেই।\n" +
                "╰━━━━━━━━━━━━━━━━━━━━╯",
                threadID,
                messageID
            );
        }

        let page = [
            "╔═══〔 💎 HRIDOY BAN LIST 💎 〕═══╗",
            `📊 Total banned: ${entries.length}`,
            ""
        ].join("\n");

        // Keep messages within a reasonable length.
        for (let i = 0; i < entries.length; i++) {
            const [id, info] = entries[i];

            page +=
                `${i + 1}. 👤 ${info.userName || "অজানা"}\n` +
                `   🆔 ${id}\n` +
                `   📝 ${info.reason || "কারণ উল্লেখ নেই"}\n` +
                `   👮 ${info.byName || "অজানা"}\n` +
                `   📅 ${getTimestamp(info.time)}\n\n`;

            if (page.length > 6000) {
                page += "\n📋 আরও ইউজার থাকলে আলাদা করে দেখাও।";
                break;
            }
        }

        page += "💠 HRIDOY HASAN SHANTO 💠";

        return api.sendMessage(page, threadID, messageID);
    }

    // TARGET REQUIRED FOR BAN / UNBAN
    const targetID = getTarget(event, args);

    if (!targetID || !/^\d+$/.test(targetID)) {
        return api.sendMessage(
            "╭━━〔 ⚠️ USAGE 〕━━╮\n" +
            "┃ /ban 123456789 Spam\n" +
            "┃ /unban 123456789\n" +
            "┃ /banlist\n" +
            "┃ অথবা ইউজারকে রিপ্লাই/মেনশন করো।\n" +
            "╰━━━━━━━━━━━━━━━━━━━━╯",
            threadID,
            messageID
        );
    }

    // UNBAN
    if (command === "unban") {
        const oldInfo = global.data.userBanned.get(targetID);

        if (!oldInfo) {
            return api.sendMessage(
                "⚠️ এই ইউজার ব্যান করা নেই।",
                threadID,
                messageID
            );
        }

        const removed = global.data.userBanned.delete(targetID);

        if (!removed || !saveBan()) {
            // Restore in-memory state if persistence failed.
            global.data.userBanned.set(targetID, oldInfo);
            return sendError(api, event, new Error("Could not save unban"));
        }

        return api.sendMessage(
            [
                "╔═══〔 🟢 UNBAN SUCCESS 〕═══╗",
                "",
                `👤 User: ${oldInfo.userName || "অজানা"}`,
                `🆔 UID: ${targetID}`,
                `📝 Previous reason: ${oldInfo.reason}`,
                `👮 Banned by: ${oldInfo.byName || "অজানা"}`,
                "",
                "✅ স্থায়ী ব্যান তালিকা থেকে সরানো হয়েছে।",
                "💠 HRIDOY HASAN SHANTO 💠",
                "╚══════════════════════════╝"
            ].join("\n"),
            threadID,
            messageID
        );
    }

    // BAN
    if (global.data.userBanned.has(targetID)) {
        const oldInfo = global.data.userBanned.get(targetID);

        return api.sendMessage(
            `⚠️ ইউজার ইতিমধ্যে ব্যান করা আছে!\n` +
            `👤 ${oldInfo.userName || "অজানা"}\n` +
            `🆔 ${targetID}\n` +
            `📝 কারণ: ${oldInfo.reason}`,
            threadID,
            messageID
        );
    }

    const userName = await getUserName(api, targetID);
    const byName = await getUserName(api, String(event.senderID));
    const reason = getReason(event, args, targetID);

    const banInfo = {
        reason,
        by: String(event.senderID),
        byName,
        time: Date.now(),
        userName
    };

    global.data.userBanned.set(targetID, banInfo);

    if (!saveBan()) {
        global.data.userBanned.delete(targetID);

        return sendError(api, event, new Error("Ban database save failed"));
    }

    return api.sendMessage(
        [
            "╔═══〔 🔴 BAN SUCCESS 〕═══╗",
            "",
            `👤 User: ${userName}`,
            `🆔 UID: ${targetID}`,
            `📝 Reason: ${reason}`,
            `👮 Banned by: ${byName}`,
            `📅 Date: ${getTimestamp(banInfo.time)}`,
            "",
            "♾️ Status: PERMANENT BAN",
            "💾 Database: SAVED",
            "💠 HRIDOY HASAN SHANTO 💠",
            "╚════════════════════════╝"
        ].join("\n"),
        threadID,
        messageID
    );
};
