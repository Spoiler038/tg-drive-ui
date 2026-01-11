/// <reference types="vite/client" />

interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  colorScheme: 'light' | 'dark';
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
