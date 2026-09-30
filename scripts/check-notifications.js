import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import { missingNotificationSettings } from '../server/notifications.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const selected = process.argv[2];
if (selected && !['sms', 'email'].includes(selected)) {
  console.error('Usage: npm run check:notifications -- [sms|email]');
  process.exit(1);
}
const env = { ...loadEnv(process.env.NODE_ENV || 'development', root, ''), ...process.env };
const missing = missingNotificationSettings(env);
const channels = selected ? [selected] : ['email', 'sms'];
for (const channel of channels) {
  const keys = missing[channel];
  console.log(`${channel.toUpperCase()}: ${keys.length ? `NOT CONFIGURED - missing ${keys.join(', ')}` : 'Settings present (live delivery not verified)'}`);
}
if (channels.some(channel => missing[channel].length)) {
  console.log('Fill in .env, restart the app, then resubmit the same registration to send confirmations skipped during setup.');
  process.exitCode = 1;
}
