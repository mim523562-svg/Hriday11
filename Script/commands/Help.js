/**
 * ╔══════════════════════════════════════════╗
 * ║       💎 HRIDOY HELP V7 PREMIUM 💎       ║
 * ║          ROYAL COMMAND CENTER             ║
 * ║       💠 HRIDOY HASAN SHANTO 💠          ║
 * ╚══════════════════════════════════════════╝
 */

const fs = require("fs-extra");
const path = require("path");
const request = require("request");

module.exports.config = {
    name: "help",
    version: "7.0.0",
    hasPermssion: 0,
    credits: "💠 HRIDOY HASAN SHANTO 💠",
    description: "Premium command menu with random GIF",
    commandCategory: "system",
    usages: "[command name]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 90
    }
};

module.exports.languages = {
    en: {
        moduleInfo: `
╭━━━〔 💎 COMMAND INFO 💎 〕━━━╮
┃
┃ ✦ Name       : %1
┃ ✦ Usage      : %2
┃ ✦ Description: %3
┃ ✦ Permission : %4
┃ ✦ Credits    : %5
┃ ✦ Category   : %6
┃ ✦ Cooldown   : %7s
┃
┃ ✦ Prefix     : %8
┃ ✦ Bot        : %9
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
💠 HRIDOY HASAN SHANTO 💠`
    }
};

function getPrefix(threadID) {
    try {
        const data = global.data.threadData.get(threadID) || {};
        return data.PREFIX || global.config.PREFIX || "/";
    } catch (_) {
        return global.config.PREFIX || "/";
    }
}

function getCommands() {
    try {
        return global.client.commands;
    } catch (_) {
        return null;
    }
}

function getRandomGif() {
    const gifs = global.client && Array.isArray(global.client.helpGifs)
        ? global.client.helpGifs.filter(url => typeof url === "string")
        : [];

    if (!gifs.length) return null;
    return gifs[Math.floor(Math.random() * gifs.length)];
}

async function getGifAttachment() {
    const gifUrl = getRandomGif();

    if (!gifUrl) {
        return { attachments: [], cleanup: () => {} };
    }

    const gifPath = path.join(
        __dirname,
        `hriday_help_${Date.now()}_${Math.floor(Math.random() * 99999)}.gif`
    );

    try {
        const response = await new Promise((resolve, reject) => {
            const output = fs.createWriteStream(gifPath);
            const req = request({
                url: gifUrl,
                timeout: 15000,
                headers: { "User-Agent": "Mozilla/5.0" }
            });

            req.on("response", res => {
                if (res.statusCode !== 200) {
                    req.abort();
                    reject(new Error(`GIF HTTP ${res.statusCode}`));
                }
            });

            req.on("error", reject);
            output.on("error", reject);
            output.on("finish", resolve);
            req.pipe(output);
        });

        if (!fs.existsSync(gifPath) || fs.statSync(gifPath).size === 0) {
            throw new Error("GIF file is empty");
        }

        return {
            attachments: [fs.createReadStream(gifPath)],
            cleanup: () => {
                setTimeout(() => {
                    try {
                        if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
                    } catch (_) {}
                }, 3000);
            }
        };
    } catch (error) {
        console.error("[HRIDOY HELP] GIF Error:", error.message);

        try {
            if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
        } catch (_) {}

        return { attachments: [], cleanup: () => {} };
    }
}

function sendHelpMessage(api, threadID, messageID, body, attachments = []) {
    return new Promise(resolve => {
        const message = { body };

        if (attachments.length) {
            message.attachment = attachments;
        }

        api.sendMessage(message, threadID, (err, info) => {
            if (err) {
                console.error("[HRIDOY HELP] Send Error:", err);
                resolve(false);
                return;
            }

            const config = module.exports.config.envConfig;

            if (config.autoUnsend && info && info.messageID) {
                setTimeout(() => {
                    api.unsendMessage(info.messageID, () => {});
                }, config.delayUnsend * 1000);
            }

            resolve(true);
        }, messageID);
    });
}

module.exports.run = async function ({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const commands = getCommands();

    if (!commands || typeof commands.get !== "function") {
        return api.sendMessage(
            "⚠️ Help system is not ready.\nPlease check the bot command loader.",
            threadID,
            messageID
        );
    }

    const prefix = getPrefix(threadID);
    const botName = global.config.BOTNAME || "HRIDOY BOT";
    const owner = global.config.Xrahat_Name || "HRIDOY HASAN SHANTO";

    // Individual command information
    if (args[0]) {
        const commandName = String(args[0]).toLowerCase();
        const cmd = commands.get(commandName);

        if (cmd && cmd.config) {
            const c = cmd.config;

            const infoText = getText
                ? getText(
                    "moduleInfo",
                    c.name || commandName,
                    c.usages || "Not provided",
                    c.description || "No description",
                    c.hasPermssion ?? c.hasPermission ?? 0,
                    c.credits || "Unknown",
                    c.commandCategory || "Other",
                    c.cooldowns || 0,
                    prefix,
                    botName
                )
                : [
                    "╭━━〔 💎 COMMAND INFO 💎 〕━━╮",
                    `┃ Name: ${c.name || commandName}`,
                    `┃ Usage: ${c.usages || "Not provided"}`,
                    `┃ Description: ${c.description || "No description"}`,
                    `┃ Permission: ${c.hasPermssion ?? c.hasPermission ?? 0}`,
                    `┃ Credits: ${c.credits || "Unknown"}`,
                    `┃ Category: ${c.commandCategory || "Other"}`,
                    `┃ Cooldown: ${c.cooldowns || 0}s`,
                    `┃ Prefix: ${prefix}`,
                    `┃ Bot: ${botName}`,
                    "╰━━━━━━━━━━━━━━━━━━━━╯",
                    "💠 HRIDOY HASAN SHANTO 💠"
                ].join("\n");

            const { attachments, cleanup } = await getGifAttachment();
            const sent = await sendHelpMessage(
                api, threadID, messageID, infoText, attachments
            );

            cleanup();

            if (!sent) {
                return api.sendMessage(infoText, threadID, messageID);
            }
            return;
        }

        return api.sendMessage(
            `╭━━〔 ⚠️ NOT FOUND ⚠️ 〕━━╮\n` +
            `┃ Command: ${commandName}\n` +
            `┃ Prefix: ${prefix}\n` +
            `┃ Try: ${prefix}help\n` +
            `╰━━━━━━━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    // Group commands by category
    const groups = new Map();

    for (const [name, cmd] of commands) {
        if (!cmd || !cmd.config) continue;

        const category = String(
            cmd.config.commandCategory || "OTHER"
        ).trim() || "OTHER";

        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push(name);
    }

    const sortedCategories = [...groups.keys()].sort((a, b) =>
        a.localeCompare(b)
    );

    let body = [
        "╔══════════════════════════╗",
        "║     💎 HRIDOY BOT 💎     ║",
        "║     PREMIUM HELP V7      ║",
        "╠══════════════════════════╣",
        "║  📚 COMMAND DIRECTORY    ║",
        "╚══════════════════════════╝"
    ].join("\n");

    for (const category of sortedCategories) {
        const names = groups.get(category).sort((a, b) =>
            a.localeCompare(b)
        );

        body += `\n\n╭━━〔 📂 ${category.toUpperCase()} 〕━━╮`;

        for (const name of names) {
            body += `\n┃ ✧ ${name}`;
        }

        body += `\n╰━━━━━━━━━━━━━━━━━━━━╯`;
    }

    body += [
        "",
        "╭━━〔 👑 BOT DETAILS 〕━━╮",
        `┃ 🤖 Bot: ${botName}`,
        `┃ 📌 Prefix: ${prefix}`,
        `┃ 📊 Commands: ${commands.size}`,
        `┃ 👑 Owner: ${owner}`,
        "╰━━━━━━━━━━━━━━━━━━━━╯",
        "",
        `💡 Details: ${prefix}help command`,
        "💠 HRIDOY HASAN SHANTO 💠"
    ].join("\n");

    const { attachments, cleanup } = await getGifAttachment();
    const sent = await sendHelpMessage(
        api, threadID, messageID, body, attachments
    );

    cleanup();

    if (!sent) {
        api.sendMessage(body, threadID, messageID);
    }
};
