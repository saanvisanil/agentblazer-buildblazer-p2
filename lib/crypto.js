import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET = process.env.SESSION_SECRET || "BuildBlazer-SJEC-Admin-2026-Secret-9xK7pLm4Qz";

// Derive 32-byte key from secret
function getKey() {
  return crypto.scryptSync(SECRET, "agentblazer-salt", 32);
}

// Encrypt string or object
export function encryptData(data) {
  try {
    const text = typeof data === "string" ? data : JSON.stringify(data);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${tag}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    return text;
  }
}

// Decrypt text back to object or string
export function decryptData(encryptedText) {
  try {
    if (!encryptedText || typeof encryptedText !== "string" || !encryptedText.includes(":")) {
      return encryptedText;
    }
    const [ivHex, tagHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !tagHex || !encrypted) return encryptedText;
    
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    // If text was not encrypted or key changed, return raw text safely
    return encryptedText;
  }
}
