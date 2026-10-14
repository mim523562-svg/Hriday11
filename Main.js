/**
 * 💠 HRIDOY MIRAI BOT V2
 * Author: 💠 HRIDOY HASAN SHANTO 💠
 * Mirai-compatible startup template
 */

"use strict";

const fs = require("fs-extra");
const path = require("path");
const express = require("express");

const APP_NAME = "💠 HRIDOY MIRAI BOT V2 💠";
const PORT = Number(process.env.PORT || 8080);

const app = express();
let botStarted = false;

/* ---------------- LOG CONTROL ---------------- */

const LOG_WINDOW = 10000;
const recentLogs = new Map();

function log(level, message) {
  const text = String(message || "").replace(/\s+/g, " ").slice(0, 500);
  const now = Date.now();
  const key = `${level}:${text}`;
  const previous = recentLogs.get(key);

  // Repeated identical logs are suppressed for 10 seconds.
  if (previous && now - previous < LOG_WINDOW) {
    return;
  }

  recentLogs.set(key, now);

  if (recentLogs.size > 1000) {
    for (const [item, time] of recentLogs) {
      if (now - time > LOG_WINDOW * 3) {
        recentLogs.delete(item);
      }
      if (recentLogs.size <= 700) break;
    }
  }

  const line = `[${new Date().toISOString()}] [${level}] ${text}`;

  if (level === "ERROR") console.error(line);
  else if (level === "WARN") console.warn(line);
  else console.log(line);
}

/* ---------------- CONFIG ---------------- */

const configPath = path.join(process.cwd(), "config.json");

if (!fs.existsSync(configPath)) {
  log("ERROR", "config.json পাওয়া যায়নি।");
  process.exit(1);
}

let config;

try {
  config = fs.readJsonSync(configPath);
} catch (error) {
  log("ERROR", `config.json পড়া যায়নি: ${error.message}`);
  process.exit(1);
}

config.Author = "💠 HRIDOY HASAN SHANTO 💠";
config.prefix = config.prefix || config.PREFIX || ".";

/* ---------------- HEALTH SERVER ---------------- */

app.get("/", (_req, res) => {
  res.status(200).send(`${APP_NAME} is running.`);
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    name: APP_NAME,
    version: "2.0.0",
    uptime: Math.floor(process.uptime()),
    botStarted
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  log("INFO", `${APP_NAME} server listening on port ${PORT}`);
});

/* ---------------- MIRAI STARTUP ---------------- */

/*
 * তোমার পুরোনো Mirai ফ্রেমওয়ার্কে যেভাবে database,
 * models এবং login/listener চালু হয়, সেটি এখানে যুক্ত
 * করতে হবে। নিচের কোডটি নিজে থেকে Facebook login করে না।
 */

async function startBot() {
  if (botStarted) return;
  botStarted = true;

  try {
    const databasePath = path.join(
      process.cwd(),
      "includes",
      "database"
    );

    const loginPath = path.join(
      process.cwd(),
      "includes",
      "login",
      "login.js"
    );

    if (!fs.existsSync(databasePath)) {
      botStarted = false;
      log("WARN", "includes/database ফোল্ডার পাওয়া যায়নি।");
      return;
    }

    if (!fs.existsSync(loginPath)) {
      botStarted = false;
      log("WARN", "includes/login/login.js পাওয়া যায়নি।");
      return;
    }

    log(
      "WARN",
      "Database ও login ফাইল পাওয়া গেছে। তোমার Mirai fork-এর আসল startup API অনুযায়ী সংযোগ প্রয়োজন।"
    );

    /*
     * পুরোনো Mirai startup code যাচাই না করে
     * login.js সরাসরি require করা হচ্ছে না।
     *
     * ভুলভাবে require করলে duplicate Messenger
     * session বা listener তৈরি হতে পারে।
     */
  } catch (error) {
    botStarted = false;
    log("ERROR", error.message);
  }
}

startBot();

/* ---------------- PROCESS ERRORS ---------------- */

process.on("unhandledRejection", (reason) => {
  log(
    "ERROR",
    `Unhandled rejection: ${
      reason instanceof Error ? reason.message : String(reason)
    }`
  );
});

process.on("uncaughtException", (error) => {
  log("ERROR", `Uncaught exception: ${error.message}`);
  server.close(() => process.exit(1));
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    log("INFO", `${signal}: shutting down.`);
    server.close(() => process.exit(0));
  });
}
