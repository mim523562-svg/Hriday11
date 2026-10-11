/**
 * ╔══════════════════════════════════════════════════╗
 * ║          🕌 HRIDOY AUTOTIME BOT V5.0             ║
 * ║             💠 HRIDOY HASAN SHANTO 💠            ║
 * ║          ISLAMIC TIME ALERT SYSTEM               ║
 * ║          MIRAI / GOATBOT COMPATIBLE               ║
 * ╚══════════════════════════════════════════════════╝
 */

const axios = require("axios");

const BOT_NAME = "💠 HRIDOY HASAN SHANTO 💠";
const TIMEZONE = "Asia/Dhaka";
const defaultAdhan = "https://i.imgur.com/95GRyZE.mp4";

// ==================== ৮ বিভাগের নামাজের সময় ====================
// নোট: এগুলো মূল কোডের দেওয়া সময়। স্থান ও তারিখ অনুযায়ী যাচাই করুন।

const divisionPrayerTimes = {
  "ঢাকা বিভাগ": {
    Fajr: "3:49 AM",
    Dhuhr: "12:56 PM",
    Asr: "3:33 PM",
    Maghrib: "6:59 PM",
    Isha: "8:28 PM"
  },
  "চট্টগ্রাম বিভাগ": {
    Fajr: "3:45 AM",
    Dhuhr: "12:52 PM",
    Asr: "3:30 PM",
    Maghrib: "6:55 PM",
    Isha: "8:24 PM"
  },
  "রাজশাহী বিভাগ": {
    Fajr: "3:52 AM",
    Dhuhr: "12:58 PM",
    Asr: "3:35 PM",
    Maghrib: "7:02 PM",
    Isha: "8:30 PM"
  },
  "খুলনা বিভাগ": {
    Fajr: "3:50 AM",
    Dhuhr: "12:57 PM",
    Asr: "3:33 PM",
    Maghrib: "6:58 PM",
    Isha: "8:27 PM"
  },
  "সিলেট বিভাগ": {
    Fajr: "3:42 AM",
    Dhuhr: "12:50 PM",
    Asr: "3:28 PM",
    Maghrib: "6:52 PM",
    Isha: "8:22 PM"
  },
  "বরিশাল বিভাগ": {
    Fajr: "3:47 AM",
    Dhuhr: "12:55 PM",
    Asr: "3:32 PM",
    Maghrib: "6:57 PM",
    Isha: "8:26 PM"
  },
  "রংপুর বিভাগ": {
    Fajr: "3:55 AM",
    Dhuhr: "12:59 PM",
    Asr: "3:37 PM",
    Maghrib: "7:04 PM",
    Isha: "8:33 PM"
  },
  "ময়মনসিংহ বিভাগ": {
    Fajr: "3:48 AM",
    Dhuhr: "12:56 PM",
    Asr: "3:33 PM",
    Maghrib: "6:58 PM",
    Isha: "8:28 PM"
  }
};

const defaultPrayerTimes = divisionPrayerTimes["ঢাকা বিভাগ"];

// ==================== দৈনিক দোয়া ====================

const dailyDua = [
  {
    time: "সকাল",
    dua: "হে আল্লাহ! আমাকে সঠিক পথে পরিচালিত করুন এবং আমার অন্তরকে ঈমানের আলোয় ভরিয়ে দিন।"
  },
  {
    time: "সকাল",
    dua: "হে আল্লাহ! আমাকে পাপ থেকে দূরে রাখুন এবং নেক আমল করার তৌফিক দিন।"
  },
  {
    time: "বিকাল",
    dua: "হে আল্লাহ! আমার রিজিকে বরকত দিন এবং আমাকে সৎকর্মশীল বান্দাদের অন্তর্ভুক্ত করুন।"
  },
  {
    time: "বিকাল",
    dua: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
  }
];

const dailyHadith = [
  "রাসুলুল্লাহ ﷺ বলেছেন: যে ব্যক্তি ভালো কাজের পথ দেখায়, সে সেই কাজ সম্পাদনকারীর সমান সওয়াব পায়। (সহিহ মুসলিম)",
  "রাসুলুল্লাহ ﷺ বলেছেন: তোমাদের মধ্যে উত্তম ব্যক্তি সে, যে কুরআন শেখে এবং অন্যকে শেখায়। (সহিহ বুখারি)"
];

const islamicQuotes = [
  "আল্লাহর ওপর ভরসা করুন; নিশ্চয়ই আল্লাহ তাঁর ওপর ভরসাকারীর জন্য যথেষ্ট।",
  "নিশ্চয়ই কষ্টের সঙ্গেই স্বস্তি রয়েছে। — সূরা আশ-শারহ ৯৪:৬"
];

const goodMorningMsg = [
  "🌅 আসসালামু আলাইকুম! সুপ্রভাত। আল্লাহর রহমতে আপনার দিনটি সুন্দর হোক।",
  "🌸 বিসমিল্লাহির রাহমানির রাহিম। নতুন দিনের শুরু হোক আল্লাহর স্মরণে।",
  "🤲 আল্লাহ আমাদের সবাইকে সঠিক পথে চলার তৌফিক দান করুন। আমিন।"
];

const goodNightMsg = [
  "🌙 শুভ রাত্রি। ঘুমানোর আগে আল্লাহকে স্মরণ করুন এবং তাঁর কাছে ক্ষমা প্রার্থনা করুন।",
  "🤲 আল্লাহ আপনার রাতকে শান্তিময় করুন এবং আপনাকে নিরাপদে রাখুন। আমিন।"
];

const ramadanMessage = [
  "🌙 রমজান মুবারক! বেশি বেশি ইবাদত করুন এবং আল্লাহর সন্তুষ্টি অর্জনের চেষ্টা করুন।",
  "🤲 আল্লাহ আমাদের রোজা, নামাজ ও নেক আমল কবুল করুন। আমিন।"
];

const dailyAmol = {
  morning: [
    "📿 সকাল-সন্ধ্যার মাসনুন যিকির পড়ুন।",
    "📖 কুরআন তিলাওয়াত করুন।",
    "🤲 নিজের ও পরিবারের জন্য দোয়া করুন।",
    "🕌 সময়মতো নামাজ আদায় করুন।"
  ],
  evening: [
    "📿 সন্ধ্যার মাসনুন যিকির পড়ুন।",
    "📖 কুরআন তিলাওয়াত করুন।",
    "🤲 নিজের ও পরিবারের জন্য দোয়া করুন।",
    "🕌 এশার নামাজ আদায় করুন।"
  ]
};

const deceasedDua = `
╔═══════ 🕊️ ═══════╗
       মৃতদের জন্য দোয়া
╚══════════════════╝

رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ

উচ্চারণ:
রাব্বানাগফির লী ওয়া লিওয়ালিদাইয়া
ওয়া লিলমু'মিনীনা ইয়াওমা ইয়াকূমুল হিসাব।

অর্থ:
হে আমাদের প্রতিপালক! হিসাব কায়েমের দিনে
আমাকে, আমার পিতা-মাতাকে এবং মুমিনদের ক্ষমা করুন।

📖 সূরা ইবরাহিম: ৪১

╔══════════════════╗
  ${BOT_NAME}
╚══════════════════╝
`;

// ==================== সময় ও তারিখ ====================

function getDhakaDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const result = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
  }

  return `${result.year}-${result.month}-${result.day}`;
}

function getDhakaParts() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());

  const result = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
  }

  return {
    hour: Number(result.hour),
    minute: Number(result.minute)
  };
}

function getBanglaDate() {
  return new Date().toLocaleDateString("bn-BD", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getEnglishDate() {
  return new Date().toLocaleDateString("en-GB", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getHijriDate() {
  try {
    return new Intl.DateTimeFormat("bn-BD-u-ca-islamic", {
      timeZone: TIMEZONE,
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());
  } catch {
    return "হিজরি তারিখ";
  }
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("bn-BD", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function parsePrayerTime(time) {
  const match = /^(\d{1,2}):(\d{2})\s+(AM|PM)$/i.exec(time);

  if (!match) return -1;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

function getPrayerTimesForDivision(name) {
  return divisionPrayerTimes[name] || defaultPrayerTimes;
}

function getRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// ==================== স্টাইলিশ মেসেজ ====================

function getHourlyFrame(dua, divisionName, prayerTimes) {
  return `
╔════════════════════════════╗
      🕌 𝗜𝗦𝗟𝗔𝗠𝗜𝗖 𝗧𝗜𝗠𝗘 𝗔𝗟𝗘𝗥𝗧
╚════════════════════════════╝

📅 ইংরেজি তারিখ: ${getEnglishDate()}
📆 বাংলা তারিখ: ${getBanglaDate()}
🌙 হিজরি তারিখ: ${getHijriDate()}
⏰ বর্তমান সময়: ${getCurrentTime()}

━━━━━━━━━━━━━━━━━━━━
       🕌 নামাজের সময়সূচি
📍 বিভাগ: ${divisionName}
━━━━━━━━━━━━━━━━━━━━

🌅 ফজর     : ${prayerTimes.Fajr}
☀️ যোহর    : ${prayerTimes.Dhuhr}
🌤️ আসর     : ${prayerTimes.Asr}
🌇 মাগরিব  : ${prayerTimes.Maghrib}
🌙 এশা      : ${prayerTimes.Isha}

━━━━━━━━━━━━━━━━━━━━
📿 আজকের দোয়া

${dua}

━━━━━━━━━━━━━━━━━━━━
💠 BOT OWNER
${BOT_NAME}
╚════════════════════════════╝
`;
}

function getPrayerReminderFrame(name, time, divisionName) {
  return `
╔════════════════════════════╗
       🕌 আজানের সময় আসন্ন
╚════════════════════════════╝

📢 ${name} নামাজের সময়
⏰ নামাজের সময়: ${time}
📍 বিভাগ: ${divisionName}

🤲 অজু করে নামাজের প্রস্তুতি নিন।
🕌 সময়মতো নামাজ আদায় করুন।

━━━━━━━━━━━━━━━━━━━━
       💠 ${BOT_NAME}
╚════════════════════════════╝
`;
}

function getGoodMorningFrame(message) {
  return `
╔════════════════════════════╗
        🌅 সুপ্রভাত 🌅
╚════════════════════════════╝

السلام عليكم ورحمة الله وبركاته

${message}

🤲 আল্লাহ আপনার দিনটি বরকতময় করুন।
🤲 সবাইকে নেক আমল করার তৌফিক দিন।

━━━━━━━━━━━━━━━━━━━━
💠 ${BOT_NAME}
╚════════════════════════════╝
`;
}

function getGoodNightFrame(message) {
  return `
╔════════════════════════════╗
        🌙 শুভ রাত্রি 🌙
╚════════════════════════════╝

${message}

🤲 আল্লাহ আমাদের সবাইকে নিরাপদে রাখুন।
📿 ঘুমানোর আগে মাসনুন দোয়া পড়ুন।

━━━━━━━━━━━━━━━━━━━━
💠 ${BOT_NAME}
╚════════════════════════════╝
`;
}

function getDailyDuaFrame(dua) {
  return `
╔════════════════════════════╗
         📿 দৈনিক দোয়া
╚════════════════════════════╝

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

${dua}

🤲 আল্লাহ আমাদের দোয়া কবুল করুন।
আমিন।

━━━━━━━━━━━━━━━━━━━━
💠 ${BOT_NAME}
╚════════════════════════════╝
`;
}

function getDailyIslamicFrame(dua, hadith, quote) {
  return `
╔════════════════════════════╗
      🌙 DAILY ISLAMIC 🌙
╚════════════════════════════╝

📿 আজকের দোয়া:
${dua}

📖 আজকের হাদিস:
${hadith}

💭 আজকের স্মরণ:
${quote}

🤲 আল্লাহ আমাদের হেদায়েত দান করুন।

━━━━━━━━━━━━━━━━━━━━
💠 ${BOT_NAME}
╚════════════════════════════╝
`;
}

function getAmolFrame(slot) {
  const title = slot === "morning" ? "সকালের আমল" : "সন্ধ্যার আমল";

  return `
╔════════════════════════════╗
        📿 ${title}
╚════════════════════════════╝

${dailyAmol[slot].join("\n\n")}

🤲 আল্লাহ আমাদের নেক আমল কবুল করুন।
আমিন।

━━━━━━━━━━━━━━━━━━━━
💠 ${BOT_NAME}
╚════════════════════════════╝
`;
}

function getRamadanFrame(message) {
  return `
╔════════════════════════════╗
        🌙 রমজান মুবারক
╚════════════════════════════╝

${message}

🤲 আল্লাহ আমাদের ইবাদত কবুল করুন।

━━━━━━━━━━━━━━━━━━━━
💠 ${BOT_NAME}
╚════════════════════════════╝
`;
}

// ==================== মডিউল কনফিগ ====================

module.exports.config = {
  name: "autotime",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "HRIDOY HASAN SHANTO",
  description: "Islamic AutoTime, Daily Dua, Hadith, Prayer Alert",
  commandCategory: "Islamic",
  usages: "autotime | autotime ডিভিশন",
  cooldowns: 5
};

// ==================== অটো টাইম সিস্টেম ====================

module.exports.onLoad = function ({ api }) {
  if (global.autotimeInterval) {
    clearInterval(global.autotimeInterval);
  }

  if (!global.currentDivision) {
    global.currentDivision = "ঢাকা বিভাগ";
  }

  const sent = new Set();
  let lastHourlyKey = "";

  async function sendToAll(message, attachmentUrl = null) {
    const threadIDs = global.data?.allThreadID || [];

    for (const threadID of threadIDs) {
      try {
        if (attachmentUrl) {
          const response = await axios.get(attachmentUrl, {
            responseType: "arraybuffer",
            timeout: 20000
          });

          const buffer = Buffer.from(response.data);

          api.sendMessage({
            body: message,
            attachment: require("stream").Readable.from(buffer)
          }, threadID);
        } else {
          api.sendMessage(message, threadID);
        }
      } catch (error) {
        console.error(
          "[AUTOTIME SEND ERROR]",
          error.message
        );

        try {
          api.sendMessage(message, threadID);
        } catch (_) {}
      }
    }
  }

  async function tick() {
    try {
      const { hour, minute } = getDhakaParts();
      const today = getDhakaDate();
      const dateKey = `${today}_${hour}_${minute}`;

      // প্রতিদিনের নতুন তারিখ এলে পুরোনো রেকর্ড মুছে ফেলা
      for (const key of sent) {
        if (!key.startsWith(today)) {
          sent.delete(key);
        }
      }

      const division = global.currentDivision;
      const prayerTimes = getPrayerTimesForDivision(division);

      // প্রতি ঘণ্টায় দোয়া
      if (minute === 0 && hour >= 0 && hour <= 23) {
        const hourlyKey = `${today}_${hour}`;

        if (lastHourlyKey !== hourlyKey) {
          lastHourlyKey = hourlyKey;

          const dua = getRandom(dailyDua).dua;

          await sendToAll(
            getHourlyFrame(dua, division, prayerTimes)
          );
        }
      }

      // সকাল ৫:১০ - দৈনিক ইসলামিক কনটেন্ট
      if (hour === 5 && minute === 10 && !sent.has(`${today}_content`)) {
        sent.add(`${today}_content`);

        await sendToAll(
          getDailyIslamicFrame(
            getRandom(dailyDua.filter(x => x.time === "সকাল")).dua,
            getRandom(dailyHadith),
            getRandom(islamicQuotes)
          )
        );
      }

      // সকাল ৫:২০ - সকালের আমল
      if (hour === 5 && minute === 20 && !sent.has(`${today}_morning_amol`)) {
        sent.add(`${today}_morning_amol`);
        await sendToAll(getAmolFrame("morning"));
      }

      // সকাল ৭:৪০ - সুপ্রভাত
      if (hour === 7 && minute === 40 && !sent.has(`${today}_morning`)) {
        sent.add(`${today}_morning`);
        await sendToAll(
          getGoodMorningFrame(getRandom(goodMorningMsg))
        );
      }

      // বিকাল ৪:৩০ - দৈনিক দোয়া
      if (hour === 16 && minute === 30 && !sent.has(`${today}_dua`)) {
        sent.add(`${today}_dua`);

        const duas = dailyDua.filter(x => x.time === "বিকাল");
        await sendToAll(getDailyDuaFrame(getRandom(duas).dua));
      }

      // সন্ধ্যা ৬টা - সন্ধ্যার আমল
      if (hour === 18 && minute === 0 && !sent.has(`${today}_evening`)) {
        sent.add(`${today}_evening`);
        await sendToAll(getAmolFrame("evening"));
      }

      // রাত ১০:৩০ - শুভ রাত্রি
      if (hour === 22 && minute === 30 && !sent.has(`${today}_night`)) {
        sent.add(`${today}_night`);
        await sendToAll(getGoodNightFrame(getRandom(goodNightMsg)));
      }

      // শুক্রবার সকাল ১১টা - মৃতদের জন্য দোয়া
      const weekday = new Date().toLocaleDateString("en-US", {
        timeZone: TIMEZONE,
        weekday: "long"
      });

      if (
        weekday === "Friday" &&
        hour === 11 &&
        minute === 0 &&
        !sent.has(`${today}_deceased`)
      ) {
        sent.add(`${today}_deceased`);
        await sendToAll(deceasedDua);
      }

      // রমজান মাসে সকাল ৪:১০ - বার্তা
      const hijri = getHijriDate();

      if (
        /রমজান|Ramadan/i.test(hijri) &&
        hour === 4 &&
        minute === 10 &&
        !sent.has(`${today}_ramadan`)
      ) {
        sent.add(`${today}_ramadan`);
        await sendToAll(getRamadanFrame(getRandom(ramadanMessage)));
      }

      // নামাজের ১০ মিনিট আগে রিমাইন্ডার
      const currentMinutes = hour * 60 + minute;

      for (const [name, time] of Object.entries(prayerTimes)) {
        const prayerMinutes = parsePrayerTime(time);
        const diff = prayerMinutes - currentMinutes;
        const prayerKey = `${today}_prayer_${division}_${name}`;

        if (diff === 10 && !sent.has(prayerKey)) {
          sent.add(prayerKey);

          await sendToAll(
            getPrayerReminderFrame(name, time, division),
            defaultAdhan
          );
        }
      }
    } catch (error) {
      console.error("[AUTOTIME ERROR]", error.message);
    }
  }

  console.log(`🕌 AUTOTIME V5.0 STARTED | ${BOT_NAME}`);

  // চালু হওয়ার সঙ্গে সঙ্গে এবং প্রতি মিনিটে চেক
  tick();
  global.autotimeInterval = setInterval(tick, 60 * 1000);
};

// ==================== কমান্ড রান ====================

module.exports.run = function ({ api, event, args = [] }) {
  const threadID = event.threadID;
  const action = String(args[0] || "").toLowerCase();

  // সব বিভাগের সময়সূচি
  if (action === "ডিভিশন" || action === "division") {
    let msg = `
╔════════════════════════════╗
       🕌 ৮ বিভাগের সময়সূচি
╚════════════════════════════╝

`;

    for (const [division, times] of Object.entries(divisionPrayerTimes)) {
      msg += `📍 ${division}\n`;
      msg += `🌅 ফজর: ${times.Fajr}\n`;
      msg += `☀️ যোহর: ${times.Dhuhr}\n`;
      msg += `🌤️ আসর: ${times.Asr}\n`;
      msg += `🌇 মাগরিব: ${times.Maghrib}\n`;
      msg += `🌙 এশা: ${times.Isha}\n\n`;
    }

    msg += `💠 ${BOT_NAME}`;

    return api.sendMessage(msg, threadID);
  }

  // বিভাগ সেট করা
  if (
    (action === "সেট" || action === "set") &&
    ["ডিভিশন", "division"].includes(
      String(args[1] || "").toLowerCase()
    )
  ) {
    const name = args.slice(2).join(" ");

    if (!divisionPrayerTimes[name]) {
      return api.sendMessage(
        `❌ বিভাগ পাওয়া যায়নি!\n\nউপলব্ধ বিভাগ:\n${Object.keys(divisionPrayerTimes).join("\n")}`,
        threadID
      );
    }

    global.currentDivision = name;

    return api.sendMessage(
      `✅ বিভাগ সেট করা হয়েছে!\n\n🕌 বিভাগ: ${name}\n💠 ${BOT_NAME}`,
      threadID
    );
  }

  const division = global.currentDivision || "ঢাকা বিভাগ";
  const times = getPrayerTimesForDivision(division);

  const msg = `
╔════════════════════════════╗
       🕌 𝗔𝗨𝗧𝗢𝗧𝗜𝗠𝗘 𝗩𝟱.𝟬
╚════════════════════════════╝

📅 তারিখ: ${getBanglaDate()}
🌙 হিজরি: ${getHijriDate()}
⏰ সময়: ${getCurrentTime()}

📍 বর্তমান বিভাগ: ${division}

━━━━━━━━━━━━━━━━━━━━
       🕌 নামাজের সময়
━━━━━━━━━━━━━━━━━━━━

🌅 ফজর: ${times.Fajr}
☀️ যোহর: ${times.Dhuhr}
🌤️ আসর: ${times.Asr}
🌇 মাগরিব: ${times.Maghrib}
🌙 এশা: ${times.Isha}

━━━━━━━━━━━━━━━━━━━━
📌 কমান্ডসমূহ

🔹 autotime ডিভিশন
   সব বিভাগের সময়সূচি

🔹 autotime সেট ডিভিশন ঢাকা বিভাগ
   বিভাগ পরিবর্তন

━━━━━━━━━━━━━━━━━━━━
💠 OWNER: ${BOT_NAME}
🕌 SYSTEM: ISLAMIC AUTOTIME
╚════════════════════════════╝
`;

  return api.sendMessage(msg, threadID);
};
