export function back(): void {
  window.history.back();
}

export function isMobile(): boolean {
  return window.innerWidth < 767;
}

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}
