const axios = require("axios");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

module.exports.config = {
  name: "install",
  version: "3.0.0",
  hasPermission: 2,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Install/Update JS Command",
  commandCategory: "System",
  usages: "[file.js] [code/link]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const reply = msg =>
    api.sendMessage(msg, threadID, messageID);

  try {
    // 💠 HRIDOY HASAN SHANTO UID
    const allowedUsers = [
      "61593296285457"
    ];

    const admins = global.config?.ADMINBOT || [];

    const isAdmin = Array.isArray(admins)
      ? admins.map(String).includes(String(senderID))
      : String(admins).split(",").includes(String(senderID));

    if (
      !allowedUsers.includes(String(senderID)) &&
      !isAdmin
    ) {
      return reply(
        "╔══════════════════════════╗\n" +
        "❌ অনুমতি নেই!\n" +
        "শুধুমাত্র অনুমোদিত Admin ব্যবহার করতে পারবে।\n" +
        "╚══════════════════════════╝"
      );
    }

    const fileName = args[0];
    const source = args.slice(1).join(" ");

    if (!fileName || !source) {
      return reply(
        "╔══════════════════════════╗\n" +
        "⚠️ ফাইলের নাম + কোড/লিংক দিন!\n\n" +
        "উদাহরণ:\n" +
        "install test.js https://example.com/test.js\n" +
        "╚══════════════════════════╝"
      );
    }

    if (
      path.basename(fileName) !== fileName ||
      fileName.includes("..") ||
      !fileName.endsWith(".js")
    ) {
      return reply("❌ অবৈধ ফাইলের নাম!");
    }

    let code = source;

    if (/^https?:\/\//i.test(source)) {
      try {
        const response = await axios.get(source, {
          timeout: 15000,
          responseType: "text",
          maxContentLength: 1024 * 1024
        });

        code = typeof response.data === "string"
          ? response.data
          : String(response.data);
      } catch (error) {
        return reply("❌ লিংক থেকে কোড আনতে সমস্যা হয়েছে!");
      }
    }

    if (!code.trim()) {
      return reply("❌ কোড খালি রাখা যাবে না!");
    }

    try {
      new vm.Script(code);
    } catch (error) {
      return reply(
        "╔══════════════════════════╗\n" +
        "❌ Syntax Error:\n" +
        error.message +
        "\n╚══════════════════════════╝"
      );
    }

    const commandsDir = path.resolve(__dirname);
    const filePath = path.resolve(commandsDir, fileName);

    if (path.dirname(filePath) !== commandsDir) {
      return reply("❌ অবৈধ ফাইল পাথ!");
    }

    const existed = fs.existsSync(filePath);

    fs.writeFileSync(filePath, code, "utf8");

    try {
      const resolvedPath = require.resolve(filePath);
      delete require.cache[resolvedPath];

      const command = require(filePath);

      if (!command.config || !command.config.name) {
        return reply(
          "⚠️ ফাইল সেভ হয়েছে, কিন্তু কমান্ডের নাম পাওয়া যায়নি!"
        );
      }

      const client = global.client;

      if (!client?.commands?.set) {
        return reply(
          "⚠️ ফাইল সেভ হয়েছে, কিন্তু Command Registry পাওয়া যায়নি!"
        );
      }

      client.commands.set(command.config.name, command);

      return reply(
        "╔══════════════════════════╗\n" +
        (existed
          ? "♻️ ফাইল আপডেট হয়েছে!\n"
          : "✅ নতুন ফাইল তৈরি হয়েছে!\n") +
        "📂 ফাইল: " + fileName + "\n" +
        "⚙️ কমান্ড: " + command.config.name + "\n" +
        "🆔 Admin UID: 61593296285457\n" +
        "👑 Owner: HRIDOY HASAN SHANTO\n" +
        "🔖 Version: 3.0.0\n" +
        "💠 HRIDOY BOT\n" +
        "╚══════════════════════════╝"
      );

    } catch (error) {
      return reply(
        "⚠️ ফাইল সেভ হয়েছে, কিন্তু Reload ব্যর্থ!\n" +
        error.message
      );
    }

  } catch (error) {
    console.error("[HRIDOY INSTALL]", error);

    return reply(
      "❌ Unexpected Error!\n" +
      "💠 HRIDOY HASAN SHANTO"
    );
  }
};
