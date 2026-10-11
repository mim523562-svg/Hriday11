const os = require("os");
const moment = require("moment-timezone");

const startTime = Date.now();

module.exports = {
  config: {
    name: "uptime",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "হৃদয় হাসান শান্ত",
    description: "Advanced HRIDOY BOT system status",
    commandCategory: "SYSTEM",
    usages: "uptime",
    prefix: false,
    cooldowns: 5
  },

  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const pingStart = Date.now();

    try {
      const uptimeSec = Math.floor((Date.now() - startTime) / 1000);

      const days = Math.floor(uptimeSec / 86400);
      const hours = Math.floor((uptimeSec % 86400) / 3600);
      const minutes = Math.floor((uptimeSec % 3600) / 60);
      const seconds = uptimeSec % 60;

      const uptimeFormatted =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const totalMem = os.totalmem() / 1073741824;
      const freeMem = os.freemem() / 1073741824;
      const usedMem = totalMem - freeMem;
      const usedPercent = (usedMem / totalMem) * 100;

      const cpus = os.cpus();
      const cpuModel = cpus[0]?.model || "Unknown";
      const cpuCount = cpus.length;
      const cpuSpeed = cpus[0]?.speed || 0;

      const now = moment.tz("Asia/Kuala_Lumpur");
      const date = now.format("DD MMMM YYYY");
      const time = now.format("hh:mm:ss A");

      const ping = Date.now() - pingStart;

      let pingStatus;
      if (ping < 100) pingStatus = "⚡ FAST";
      else if (ping < 250) pingStatus = "🚀 STABLE";
      else pingStatus = "⚠️ SLOW";

      let status;
      if (usedPercent < 70) {
        status = "✅ SYSTEM STABLE";
      } else if (usedPercent < 90) {
        status = "⚠️ HIGH LOAD";
      } else {
        status = "⛔ CRITICAL";
      }

      const finalMsg = `
╭━━━〔 💠 HRIDOY BOT V3 💠 〕━━━╮
┃
┃ 👑 OWNER : হৃদয় হাসান শান্ত
┃ 🤖 BOT : HRIDOY BOT
┃
┣━━━━━━━━━━━━━━━━━━
┃ ⏱️ UPTIME
┃ ${uptimeFormatted}
┃
┃ 💻 OS : ${os.type()} ${os.arch()}
┃ 🧠 CPU : ${cpuModel}
┃ 🔢 CORES : ${cpuCount}
┃ ⚙️ SPEED : ${cpuSpeed} MHz
┃
┣━━━━━━━━━━━━━━━━━━
┃ 💾 RAM : ${usedMem.toFixed(2)} GB
┃ 📦 TOTAL : ${totalMem.toFixed(2)} GB
┃ 📊 USAGE : ${usedPercent.toFixed(1)}%
┃ 🧩 NODE : ${process.version}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 📅 DATE : ${date}
┃ 🕒 TIME : ${time}
┃ 📡 ELAPSED : ${ping} ms
┃ 🚦 PING STATUS : ${pingStatus}
┃ 🛡️ STATUS : ${status}
┃
╰━━━〔 💠 HRIDOY SYSTEM 💠 〕━━━╯
`;

      return api.sendMessage(finalMsg, threadID, messageID);

    } catch (error) {
      console.error("HRIDOY Uptime Error:", error);
      return api.sendMessage(
        "❌ Uptime command error! Please check the bot logs.",
        threadID,
        messageID
      );
    }
  }
};
