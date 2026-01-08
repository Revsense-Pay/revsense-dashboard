import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET = process.env.APP_ENCRYPTION_KEY; // 32 chars

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

export function decrypt(payload) {
  const [ivHex, tagHex, encrypted] = payload.split(':');

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET),
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}