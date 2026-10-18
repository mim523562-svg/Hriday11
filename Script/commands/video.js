/**
 * ╔══════════════════════════════════════════════╗
 * ║          💎 HRIDOY VIDEO V7 PREMIUM          ║
 * ║        🎬 YOUTUBE MEDIA DOWNLOADER            ║
 * ║        💠 HRIDOY HASAN SHANTO 💠             ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CONFIG = {
    API_CONFIG_URL:
        "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json",
    TIMEOUT: 60000,
    MAX_RESULTS: 6
};

const http = axios.create({
    timeout: CONFIG.TIMEOUT,
    maxRedirects: 5,
    headers: { "User-Agent": "Mozilla/5.0" }
});

async function getBaseApiUrl() {
    const response = await http.get(CONFIG.API_CONFIG_URL);
    const api = response.data && response.data.api;

    if (typeof api !== "string" || !/^https?:\/\//i.test(api)) {
        throw new Error("Invalid API base URL");
    }

    return api.replace(/\/+$/, "");
}

function getTempPath(prefix, extension) {
    return path.join(
        __dirname,
        `${prefix}_${Date.now()}_${Math.random()
            .toString(36).slice(2, 9)}.${extension}`
    );
}

function formatSize(bytes) {
    if (!Number.isFinite(Number(bytes))) return "Unknown";
    const mb = Number(bytes) / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
}

function formatDuration(seconds) {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value < 0) return "Unknown";

    const h = Math.floor(value / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = Math.floor(value % 60);

    return h
        ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
        : `${m}:${String(s).padStart(2, "0")}`;
}

function getAction(value) {
    const action = String(value || "-v").toLowerCase();

    if (["-v", "video", "mp4"].includes(action)) return "video";
    if (["-a", "audio", "mp3", "music"].includes(action)) return "audio";
    if (["-i", "info"].includes(action)) return "info";

    return null;
}

function getVideoId(input) {
    if (!input) return null;

    try {
        const url = new URL(
            /^https?:\/\//i.test(input) ? input : `https://${input}`
        );

        let id = null;

        if (url.hostname === "youtu.be" ||
            url.hostname === "www.youtu.be") {
            id = url.pathname.split("/").filter(Boolean)[0];
        } else if (
            ["youtube.com", "www.youtube.com", "m.youtube.com",
             "music.youtube.com"].includes(url.hostname)
        ) {
            if (url.pathname === "/watch") {
                id = url.searchParams.get("v");
            } else {
                const match = url.pathname.match(
                    /^\/(?:shorts|embed|live|v)\/([^/]+)/
                );
                if (match) id = match[1];
            }
        }

        return id && /^[\w-]{11}$/.test(id) ? id : null;
    } catch (_) {
        return null;
    }
}

async function downloadFile(url, extension) {
    if (!/^https?:\/\//i.test(url || "")) {
        throw new Error("Invalid download URL");
    }

    const filePath = getTempPath("hriday_video", extension);

    try {
        const response = await http.get(url, {
            responseType: "arraybuffer",
            timeout: CONFIG.TIMEOUT,
            maxContentLength: 100 * 1024 * 1024,
            maxBodyLength: 100 * 1024 * 1024
        });

        if (!response.data || !response.data.byteLength) {
            throw new Error("Downloaded file is empty");
        }

        await fs.writeFile(filePath, Buffer.from(response.data));

        return {
            path: filePath,
            size: response.data.byteLength
        };
    } catch (error) {
        await fs.remove(filePath).catch(() => {});
        throw error;
    }
}

async function downloadThumbnail(url) {
    if (!/^https?:\/\//i.test(url || "")) return null;

    const filePath = getTempPath("hriday_thumb", "jpg");

    try {
        const response = await http.get(url, {
            responseType: "arraybuffer",
            timeout: 20000,
            maxContentLength: 8 * 1024 * 1024
        });

        await fs.writeFile(filePath, Buffer.from(response.data));

        if (!(await fs.stat(filePath)).size) {
            throw new Error("Empty thumbnail");
        }

        return filePath;
    } catch (_) {
        await fs.remove(filePath).catch(() => {});
        return null;
    }
}

function safeUnsend(api, messageID) {
    if (!messageID) return;

    setTimeout(() => {
        api.unsendMessage(messageID, () => {});
    }, 90000);
}

function sendMessage(api, message, threadID, replyTo) {
    return new Promise((resolve, reject) => {
        api.sendMessage(message, threadID, (err, info) => {
            if (err) return reject(err);
            resolve(info);
        }, replyTo);
    });
}

async function sendDownload(api, threadID, replyTo, videoID, format) {
    const waitMessage = await sendMessage(
        api,
        "╭━━〔 💎 HRIDOY VIDEO 💎 〕━━╮\n" +
        "┃ ⏳ Preparing your download...\n" +
        "┃ 🎬 Please wait a moment!\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯",
        threadID,
        replyTo
    ).catch(() => null);

    let filePath;

    try {
        const base = await getBaseApiUrl();

        const response = await http.get(`${base}/ytDl3`, {
            params: {
                link: videoID,
                format,
                quality: 3
            }
        });

        const data = response.data || {};

        if (!data.downloadLink) {
            throw new Error(data.message || "Download link not returned");
        }

        const file = await downloadFile(
            data.downloadLink,
            format === "mp3" ? "mp3" : "mp4"
        );

        filePath = file.path;

        const body = [
            "╭━━〔 💎 HRIDOY VIDEO V7 💎 〕━━╮",
            "",
            `🎬 Title: ${data.title || "Unknown"}`,
            `📁 Format: ${format.toUpperCase()}`,
            `📺 Quality: ${data.quality || "Available quality"}`,
            `💾 Size: ${formatSize(file.size)}`,
            "",
            "💠 HRIDOY HASAN SHANTO 💠",
            "╰━━━━━━━━━━━━━━━━━━━━╯"
        ].join("\n");

        const attachment = fs.createReadStream(filePath);

        await sendMessage(api, {
            body,
            attachment
        }, threadID, replyTo);

    } finally {
        if (waitMessage && waitMessage.messageID) {
            api.unsendMessage(waitMessage.messageID, () => {});
        }

        if (filePath) {
            setTimeout(() => {
                fs.remove(filePath).catch(() => {});
            }, 15000);
        }
    }
}

module.exports = {
    config: {
        name: "video",
        version: "7.0.0",
        credits: "💠 HRIDOY HASAN SHANTO 💠",
        countDown: 5,
        hasPermssion: 0,
        description: "Premium YouTube video, audio and information",
        category: "media",
        commandCategory: "media",
        usePrefix: true,
        prefix: true,
        usages:
            "{pn} -v <video name/link>\n" +
            "{pn} -a <video name/link>\n" +
            "{pn} -i <video name/link>\n" +
            "Example: {pn} -v music name"
    },

    run: async function ({ api, args, event }) {
        const { threadID, messageID, senderID } = event;

        // Parse action without accidentally removing the search keyword.
        let action = getAction(args[0]);
        let queryArgs = args.slice();

        if (action) {
            queryArgs.shift();
        } else {
            action = "video";
        }

        const query = queryArgs.join(" ").trim();

        if (!query) {
            return api.sendMessage(
                "╭━━〔 💎 HRIDOY VIDEO MENU 💎 〕━━╮\n" +
                "┃ 🎬 -v <name/link> : Video\n" +
                "┃ 🎵 -a <name/link> : Audio\n" +
                "┃ 📊 -i <name/link> : Video info\n" +
                "┃\n" +
                "┃ Example: .video -v relaxing music\n" +
                "┃ Example: .video -a song name\n" +
                "╰━━━━━━━━━━━━━━━━━━━━╯",
                threadID,
                messageID
            );
        }

        const videoID = getVideoId(query);

        // Direct YouTube link
        if (videoID) {
            if (action === "info") {
                return this.getVideoInfo(api, threadID, messageID, videoID);
            }

            try {
                return await sendDownload(
                    api,
                    threadID,
                    messageID,
                    videoID,
                    action === "audio" ? "mp3" : "mp4"
                );
            } catch (error) {
                console.error("[HRIDOY VIDEO] Download:", error.message);

                return api.sendMessage(
                    "❌ Download failed.\n" +
                    "API unavailable, invalid response, or file too large.\n\n" +
                    "💠 HRIDOY HASAN SHANTO 💠",
                    threadID,
                    messageID
                );
            }
        }

        // Search by keyword
        try {
            const base = await getBaseApiUrl();

            const response = await http.get(`${base}/ytFullSearch`, {
                params: { songName: query }
            });

            const results = Array.isArray(response.data)
                ? response.data.slice(0, CONFIG.MAX_RESULTS)
                : [];

            if (!results.length) {
                return api.sendMessage(
                    `⭕ No results found for: ${query}`,
                    threadID,
                    messageID
                );
            }

            const validResults = results.filter(item =>
                item && item.id && item.title
            );

            if (!validResults.length) {
                return api.sendMessage(
                    "❌ Search returned no usable video results.",
                    threadID,
                    messageID
                );
            }

            let body = [
                "╭━━〔 💎 HRIDOY VIDEO SEARCH 💎 〕━━╮",
                "",
                `🔎 Search: ${query}`,
                ""
            ].join("\n");

            validResults.forEach((item, index) => {
                body +=
                    `╭─〔 ${index + 1} 〕\n` +
                    `┃ 🎬 ${item.title}\n` +
                    `┃ ⏱️ ${item.time || "Unknown"}\n` +
                    `┃ 📺 ${item.channel?.name || "Unknown"}\n` +
                    `╰──────────────\n`;
            });

            body +=
                "\n💬 Reply with a number to select.\n" +
                "╰━━━━━━━━━━━━━━━━━━━━╯\n" +
                "💠 HRIDOY HASAN SHANTO 💠";

            // Attach one thumbnail if available; don't fail search if it isn't.
            const thumbPath = await downloadThumbnail(
                validResults[0].thumbnail
            );

            const message = { body };

            if (thumbPath) {
                message.attachment = fs.createReadStream(thumbPath);
            }

            api.sendMessage(message, threadID, (err, info) => {
                if (thumbPath) {
                    setTimeout(() => {
                        fs.remove(thumbPath).catch(() => {});
                    }, 15000);
                }

                if (err) {
                    console.error("[HRIDOY VIDEO] Search send:", err);
                    return;
                }

                global.client.handleReply.push({
                    name: module.exports.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    result: validResults,
                    action
                });
            }, messageID);

        } catch (error) {
            console.error("[HRIDOY VIDEO] Search:", error.message);

            return api.sendMessage(
                "❌ Search failed. Please try again later.\n\n" +
                "💠 HRIDOY HASAN SHANTO 💠",
                threadID,
                messageID
            );
        }
    },

    handleReply: async function ({ api, event, handleReply }) {
        const { threadID, messageID, senderID, body } = event;

        if (senderID !== handleReply.author) return;

        const choice = Number(String(body).trim());
        const results = handleReply.result || [];

        if (
            !Number.isInteger(choice) ||
            choice < 1 ||
            choice > results.length
        ) {
            return api.sendMessage(
                "❌ Invalid selection. Reply with a number from 1 to " +
                results.length + ".",
                threadID,
                messageID
            );
        }

        const selected = results[choice - 1];
        const videoID = getVideoId(selected.id) || selected.id;

        if (!videoID) {
            return api.sendMessage(
                "❌ Invalid video ID returned by search.",
                threadID,
                messageID
            );
        }

        try {
            api.unsendMessage(handleReply.messageID, () => {});

            if (handleReply.action === "info") {
                return this.getVideoInfo(
                    api, threadID, messageID, videoID
                );
            }

            return await sendDownload(
                api,
                threadID,
                messageID,
                videoID,
                handleReply.action === "audio" ? "mp3" : "mp4"
            );

        } catch (error) {
            console.error("[HRIDOY VIDEO] Reply:", error.message);

            return api.sendMessage(
                "❌ Unable to process the selected video.\n" +
                "Please try another result.",
                threadID,
                messageID
            );
        }
    },

    getVideoInfo: async function (api, threadID, messageID, videoID) {
        let thumbPath;

        try {
            const base = await getBaseApiUrl();

            const response = await http.get(`${base}/ytfullinfo`, {
                params: { videoID }
            });

            const data = response.data || {};

            const body = [
                "╭━━〔 💎 VIDEO INFORMATION 💎 〕━━╮",
                "",
                `🎬 Title: ${data.title || "Unknown"}`,
                `⏱️ Duration: ${formatDuration(data.duration)}`,
                `📺 Resolution: ${data.resolution || "Unknown"}`,
                `👀 Views: ${data.view_count ?? "Unknown"}`,
                `👍 Likes: ${data.like_count ?? "Unknown"}`,
                `💬 Comments: ${data.comment_count ?? "Unknown"}`,
                `📂 Category: ${data.categories?.[0] || "Unknown"}`,
                `📢 Channel: ${data.channel || "Unknown"}`,
                `👥 Subscribers: ${data.channel_follower_count ?? "Unknown"}`,
                `🔗 Channel: ${data.channel_url || "Unknown"}`,
                `🌐 Video: ${data.webpage_url || "Unknown"}`,
                "",
                "💠 HRIDOY HASAN SHANTO 💠",
                "╰━━━━━━━━━━━━━━━━━━━━╯"
            ].join("\n");

            thumbPath = await downloadThumbnail(data.thumbnail);

            const message = { body };

            if (thumbPath) {
                message.attachment = fs.createReadStream(thumbPath);
            }

            await sendMessage(api, message, threadID, messageID);

        } catch (error) {
            console.error("[HRIDOY VIDEO] Info:", error.message);

            return api.sendMessage(
                "❌ Unable to retrieve video information.",
                threadID,
                messageID
            );
        } finally {
            if (thumbPath) {
                setTimeout(() => {
                    fs.remove(thumbPath).catch(() => {});
                }, 15000);
            }
        }
    }
};
