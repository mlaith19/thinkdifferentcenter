const crypto = require("crypto");

// Ensure the secret is exactly 32 bytes long
const ENCRYPTION_SECRET =  "2d489b9f4208226b561a3c8b71f22e63749440e3d0c1024f465c96f563138617"; // 32 bytes
const ENCRYPTION_ALGORITHM = "aes-256-cbc";

function encryptLicenseKey(data) {
  const iv = crypto.randomBytes(16); // Initialization vector (16 bytes)
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_SECRET, "hex"), iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decryptLicenseKey(encryptedData) {
  const [ivHex, encryptedHex] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_SECRET, "hex"), iv);
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function generateLicenseKey(startDate, endDate) {
  const randomPart = crypto.randomBytes(4).toString("hex");  
  return `${startDate}||${endDate}||${randomPart}`;
}

module.exports = {
  encryptLicenseKey,
  decryptLicenseKey,
  generateLicenseKey,
};