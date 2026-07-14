export function setTokenCookie(token: string, isProduction: boolean): string {
  return [
    `token=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    `Max-Age=${7 * 24 * 60 * 60}`,
    isProduction ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

export function clearTokenCookie(): string {
  return 'token=; HttpOnly; Path=/; Max-Age=0';
}
