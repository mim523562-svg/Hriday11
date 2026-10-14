
  // 💠 HRIDOY HASAN SHANTO 💠
  // Thread Info Cache + Rate Limit Protection

  const threadInfoCache = new Map();
  const threadInfoCooldown = new Map();

  const THREAD_CACHE_TTL = 5 * 60 * 1000;
  const THREAD_ERROR_COOLDOWN = 60 * 1000;

  const handleMention = async (api, event) => {
    try {
      const { threadID, body } = event;

      if (!threadID || !body) return;

      if (
        event.mentions &&
        Object.keys(event.mentions).length > 0
      ) return;

      if (
        event.messageReply &&
        event.messageReply.senderID
      ) {
        event.mentions = {
          [event.messageReply.senderID]: ""
        };
        return;
      }

      const mentionMatch = body.match(/@([^\s]+)/);
      if (!mentionMatch) return;

      const searchName = mentionMatch[1]
        .toLowerCase()
        .trim()
        .replace(/[.,!?]+$/, "");

      if (!searchName) return;

      const now = Date.now();
      const id = String(threadID);

      let threadInfo;
      const cached = threadInfoCache.get(id);

      // Reuse recent group information
      if (cached && now - cached.time < THREAD_CACHE_TTL) {
        threadInfo = cached.data;
      } else {
        // Avoid repeated requests while rate-limited
        const cooldownUntil = threadInfoCooldown.get(id) || 0;
        if (now < cooldownUntil) return;

        try {
          threadInfo = await api.getThreadInfo(threadID);

          if (!threadInfo) return;

          threadInfoCache.set(id, {
            data: threadInfo,
            time: Date.now()
          });

          threadInfoCooldown.delete(id);
        } catch (error) {
          threadInfoCooldown.set(
            id,
            Date.now() + THREAD_ERROR_COOLDOWN
          );

          console.error(
            "[HRIDOY BOT] getThreadInfo failed:",
            error.message || error
          );
          return;
        }
      }

      const userInfo = threadInfo.userInfo || [];
      const nicknames = threadInfo.nicknames || {};

      const normalize = value =>
        String(value || "")
          .toLowerCase()
          .replace(/\s+/g, "");

      const query = normalize(searchName);
      let matchedUserID = null;

      // Search group nicknames
      for (const userID of Object.keys(nicknames)) {
        if (normalize(nicknames[userID]).includes(query)) {
          matchedUserID = userID;
          break;
        }
      }

      // Search member names
      if (!matchedUserID) {
        for (const user of userInfo) {
          if (
            user.name &&
            normalize(user.name).includes(query)
          ) {
            matchedUserID = user.id;
            break;
          }
        }
      }

      // Search the beginning of a name
      if (!matchedUserID && query.length >= 2) {
        for (const user of userInfo) {
          if (
            user.name &&
            normalize(user.name).startsWith(query)
          ) {
            matchedUserID = user.id;
            break;
          }
        }
      }

      if (matchedUserID) {
        event.mentions = {
          [matchedUserID]: ""
        };
      }
    } catch (error) {
      console.error(
        "[HRIDOY BOT] handleMention error:",
        error.message || error
      );
    }
  };
