// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;

export const tg = w.Telegram?.WebApp;

export function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
}
