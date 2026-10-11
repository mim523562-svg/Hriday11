const fs = global.nodemodule["fs-extra"];
const axios = global.nodemodule["axios"];

module.exports.config = {
  name: "info",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Stylish Bot Information System",
  commandCategory: "For users",
  hide: false,
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({
  api,
  event,
  Threads
}) {
  const { threadID, messageID } = event;

  try {
    const { configPath } = global.client;
    delete require.cache[require.resolve(configPath)];
    const config = require(configPath);

    const commands = global.client.commands;
    const threadData = await Threads.getData(String(threadID));
    const threadSetting = threadData.data || {};

    const prefix = threadSetting.PREFIX || config.PREFIX || ".";

    const uptime = Math.floor(process.uptime());
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    const totalUsers =
      global.data.allUserID?.length || 0;

    const totalThreads =
      global.data.allThreadID?.length || 0;

    const ping = Date.now() - (event.timestamp || Date.now());

    const botName = config.BOTNAME || "HRIDOY BOT V2";
    const ownerName = "হৃদয় হাসান শান্ত";
    const facebook =
      "https://www.facebook.com/share/1DQCCDQ1iV/";

    const msg = `
╭━━━〔 💠 HRIDOY BOT 💠 〕━━━╮
┃
┃  💖 ${botName}
┃  ✨ স্বাগতম আমার বট সিস্টেমে!
┃
┣━━━━━━━━━━━━━━━━━━
┃ 🤖 BOT INFORMATION
┣━━━━━━━━━━━━━━━━━━
┃
┃ 💠 Bot Name : ${botName}
┃ ⚡ Prefix   : ${config.PREFIX || "."}
┃ 📌 Box Prefix : ${prefix}
┃ 🧩 Commands : ${commands.size}
┃ 📡 Ping     : ${ping} ms
┃
┣━━━━━━━━━━━━━━━━━━
┃ 👑 OWNER INFORMATION
┣━━━━━━━━━━━━━━━━━━
┃
┃ 💎 Name : ${ownerName}
┃ 🌐 Facebook:
┃ ${facebook}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 📊 BOT STATISTICS
┣━━━━━━━━━━━━━━━━━━
┃
┃ ⏱️ Uptime :
┃ ${days}d ${hours}h ${minutes}m ${seconds}s
┃
┃ 👥 Total Users : ${totalUsers}
┃ 💬 Total Groups: ${totalThreads}
┃ 🆔 Thread ID   : ${threadID}
┃
╰━━━━━━━━━━━━━━━━━━
   💫 THANKS FOR USING 💫

     💠 HRIDOY BOT V2 💠
    ⚙️ Powered by HRIDOY
╰━━━━━━━━━━━━━━━━━━╯`;

    const imageURL = "https://i.imgur.com/rNQJ9OA.jpeg";
    const cacheDir = __dirname + "/cache";

    await fs.ensureDir(cacheDir);

    const imagePath = cacheDir + "/hriday-info.jpg";

    const response = await axios.get(imageURL, {
      responseType: "arraybuffer",
      timeout: 15000
    });

    await fs.writeFile(imagePath, response.data);

    return api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(imagePath)
      },
      threadID,
      (err) => {
        fs.unlink(imagePath).catch(() => {});

        if (err) {
          console.error("[INFO SEND ERROR]", err);
        }
      },
      messageID
    );
  } catch (error) {
    console.error("[INFO COMMAND ERROR]", error);

    return api.sendMessage(
      "❌ বটের তথ্য দেখাতে সমস্যা হয়েছে!\n💠 কিছুক্ষণ পর আবার চেষ্টা করো।",
      threadID,
      null,
      messageID
    );
  }
};
