const token = process.env.BOT_TOKEN;
const channel = process.env.CHANNEL_USERNAME;

if (!token || !channel) {
  console.error('Missing BOT_TOKEN or CHANNEL_USERNAME.');
  process.exit(1);
}

const text = `RTMN — YOUR STYLE, YOUR RULES. 🖤\n\nDiscover our latest drops and everyday essentials.`;

const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: channel,
    text,
    reply_markup: {
      inline_keyboard: [[{ text: '🛍 ВІДКРИТИ МАГАЗИН', url: 'https://t.me/RTMN_shop_bot?startapp' }]]
    }
  })
});

const data = await response.json();
if (!data.ok) {
  console.error('Telegram error:', data.description);
  process.exit(1);
}
console.log('Готово: пост із кнопкою опубліковано в каналі.');
