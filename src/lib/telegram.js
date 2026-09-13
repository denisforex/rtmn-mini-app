export function initializeTelegram(theme = "light") {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) return false;

  const color = theme === "dark" ? "#0b0b0c" : "#f5f2ec";
  webApp.ready();
  webApp.expand?.();
  webApp.setHeaderColor?.(color);
  webApp.setBackgroundColor?.(color);
  return true;
}

export function telegramHaptic(style = "light") {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(style);
}
