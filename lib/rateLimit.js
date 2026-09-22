// Bounded, fixed-window limiter for lightweight public forms.  The hard cap
// and periodic pruning prevent an attacker from growing process memory by
// submitting requests with many spoofed IP addresses.
const MAX_TRACKED_KEYS = 5_000;

export function createRateLimiter({ limit, windowMs, maxKeys = MAX_TRACKED_KEYS }) {
  const entries = new Map();

  return function rateLimited(key) {
    const now = Date.now();
    for (const [existingKey, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(existingKey);
    }

    const current = entries.get(key);
    if (current) {
      current.count += 1;
      return current.count > limit;
    }

    if (entries.size >= maxKeys) {
      // Refuse a new, untracked key rather than allowing unbounded memory.
      return true;
    }
    entries.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  };
}
