const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "funny",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "FARHAN-KHAN",
  description: "Send random funny video",
  commandCategory: "media",
  usages: "funny",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const captions = [
    "𝘩𝘳𝘪𝘥𝘢𝘺 𝘩𝘢𝘴𝘴𝘯𝘢 𝘴𝘩𝘢𝘯𝘵𝘰🤦‍♂️-)"
  ];

  const links = [
    "https://drive.google.com/uc?id=1Zg6YCrfLNFVPuIarV3ZBvyg9NW9vKf-i",
    "https://drive.google.com/uc?id=1Tu7vjhlkUls3SKSTl-pGK3y69NYgeGMe",
    "https://drive.google.com/uc?id=1vHhwiHHDRJpflMGCU0Alg7A5ARkugLya",
    "https://drive.google.com/uc?id=1KrHanrUqkqr0kFjFh1abl72xlmZ0_18a",
    "https://drive.google.com/uc?id=1rs6cbx8oOYg2Zgi_0UZHfbDhEz8LjFlU",
    "https://drive.google.com/uc?id=1thJh4_fG8DYdgKiOhsy8Jkp98O0m-23b",
    "https://drive.google.com/uc?id=1T5x_hAEu5yozou0HeNrCHC6GS3XbgTSx",
    "https://drive.google.com/uc?id=1CRvedhuz9z2JWLY6LH2dNgtt7cwuBBsG",
    "https://drive.google.com/uc?id=1RbPFrHj4y7eno8OsAuYElOfdOsJ75eZp",
    "https://drive.google.com/uc?id=1mY0B0yGi90h0K1GvxVdZ7eLkj-Q-W2Eq",
    "https://drive.google.com/uc?id=1xgh5EePrQq62zeDRu2YAkJTrAXSCXpOp",
    "https://drive.google.com/uc?id=1-aZjX6vnC1HDn25jBoexmyLBlm6bLwli",
    "https://drive.google.com/uc?id=1znMcAJbcDnS0oDG6LCUH8PN0gZOJxhRC",
    "https://drive.google.com/uc?id=1teEOVYZwvGuz75_Is_ZEEvZwroB1IZW8",
    "https://drive.google.com/uc?id=10gQjKcAL8MkXOqi8vLYqPYiFg0_Qh-rR",
    "https://drive.google.com/uc?id=1b0xOpxhPq0xZO7QDpU4BZ-OnRKYPMdLD",
    "https://drive.google.com/uc?id=1-KLse2-7YKacnPGL7zHH5_KOHQUbVUt0"
  ];

  const caption = captions[Math.floor(Math.random() * captions.length)];
  const video = links[Math.floor(Math.random() * links.length)];

  const cacheDir = path.join(__dirname, "cache");
  const filePath = path.join(cacheDir, "funny.mp4");

  try {
    await fs.ensureDir(cacheDir);

    const response = await axios({
      url: video,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: caption,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });

    writer.on("error", () => {
      api.sendMessage("❌ ভিডিও পাঠাতে সমস্যা হয়েছে!", event.threadID);
    });

  } catch (e) {
    console.log(e);
    api.sendMessage("❌ কিছু একটা সমস্যা হয়েছে ভিডিও আনতে।", event.threadID);
  }
};
