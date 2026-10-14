
const logCooldowns = new Map();

function logWithCooldown(key, message, cooldown = 30000) {
  const now = Date.now();
  const last = logCooldowns.get(key) || 0;

  if (now - last < cooldown) return;

  logCooldowns.set(key, now);
  console.error(message);

  if (logCooldowns.size > 500) {
    for (const [k, time] of logCooldowns) {
      if (now - time > cooldown * 2) {
        logCooldowns.delete(k);
      }
    }
  }
}
