import crypto from 'crypto';

const ENCRYPTED_PREFIX = 'enc:v1:';

function getEncryptionKey() {
  const raw = process.env.UNIFI_SECRET_KEY?.trim() || '';
  if (!raw) return null;

  // Accept base64 (preferred) or plain 32-char secret.
  const fromBase64 = Buffer.from(raw, 'base64');
  if (fromBase64.length === 32) return fromBase64;

  const fromUtf8 = Buffer.from(raw, 'utf8');
  if (fromUtf8.length === 32) return fromUtf8;

  return null;
}

export function encryptUnifiSecret(value?: string | null) {
  if (!value) return null;
  const key = getEncryptionKey();
  if (!key) return value;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${ENCRYPTED_PREFIX}${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
}

export function decryptUnifiSecret(value?: string | null) {
  if (!value) return null;
  if (!value.startsWith(ENCRYPTED_PREFIX)) return value;

  const key = getEncryptionKey();
  if (!key) return null;

  const payload = value.slice(ENCRYPTED_PREFIX.length);
  const [ivB64, tagB64, dataB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !dataB64) return null;

  try {
    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return null;
  }
}

