export function getConfiguredAppPublicUrl() {
  return process.env.APPGPP_PUBLIC_URL?.trim() || process.env.NEXTAUTH_URL?.trim() || '';
}

export function getAppPublicUrlInfo(options: {
  explicitUrl?: string | null;
  savedUrl?: string | null;
  requestOrigin?: string | null;
} = {}) {
  const explicitUrl = options.explicitUrl?.trim() || '';
  const savedUrl = options.savedUrl?.trim() || '';
  const requestOrigin = options.requestOrigin?.trim() || '';
  const envUrl = getConfiguredAppPublicUrl();

  if (explicitUrl) return { url: explicitUrl, source: 'explicit' as const };
  if (savedUrl) return { url: savedUrl, source: 'config' as const };
  if (envUrl) return { url: envUrl, source: 'env' as const };
  if (requestOrigin) return { url: requestOrigin, source: 'request' as const };

  return { url: '', source: 'unknown' as const };
}

export function resolveAppBaseUrl(options: {
  explicitUrl?: string | null;
  savedUrl?: string | null;
  requestOrigin?: string | null;
}) {
  return getAppPublicUrlInfo(options).url;
}
