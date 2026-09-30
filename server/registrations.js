import { mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { normalizeRegistration, registrationError, containsControlCharacters } from '../src/lib/registration.js';
import { notificationConfig, sendConfirmation, missingNotificationSettings } from './notifications.js';

const fail = (status, message) => Object.assign(new Error(message), { status });

function validatePayload(body) {
  if (!body || typeof body !== 'object' || !body.registration || !body.event) {
    throw fail(400, 'Please provide event and registration details.');
  }
  if (typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,64}$/.test(body.requestId)) {
    throw fail(400, 'Invalid registration request. Please refresh and try again.');
  }
  const registration = normalizeRegistration(body.registration);
  const error = registrationError(registration);
  if (error) throw fail(400, error);
  const event = {};
  for (const [key, max] of Object.entries({ id: 80, name: 160, date: 10, time: 5, venue: 200 })) {
    const value = body.event[key];
    if (typeof value !== 'string' || !value.trim() || value.length > max || containsControlCharacters(value)) {
      throw fail(400, 'Invalid event details. Please contact the organizer.');
    }
    event[key] = value.trim();
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) {
    throw fail(400, 'Invalid event date or time.');
  }
  return { requestId: body.requestId, event, registration };
}

function publicResult(record, replayed = false) {
  return {
    registration: {
      ...record.registration,
      notifications: Object.fromEntries(Object.entries(record.notifications).map(([key, value]) => [key, { status: value.status }])),
    },
    replayed,
  };
}

export function createRegistrationService({ env = process.env, dataFile = resolve('server/data/registrations.json'), fetchImpl = fetch } = {}) {
  let records = [];
  try {
    records = JSON.parse(readFileSync(dataFile, 'utf8'));
    if (!Array.isArray(records)) throw new Error('Invalid registration data file.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const save = () => {
    mkdirSync(dirname(dataFile), { recursive: true });
    writeFileSync(`${dataFile}.tmp`, JSON.stringify(records, null, 2), { mode: 0o600 });
    renameSync(`${dataFile}.tmp`, dataFile);
  };
  // A process restart cannot establish whether an interrupted provider request was sent.
  for (const record of records) {
    for (const value of Object.values(record.notifications)) {
      if (value.status === 'sending') value.status = 'unknown';
    }
  }
  const pending = new Map();

  const sendNotifications = async (record, channels) => {
    if (!channels.length) return;
    const previous = { ...record.notifications };
    for (const channel of channels) record.notifications[channel] = { status: 'sending' };
    // Claim the channels durably before calling providers, including on a retry after setup.
    try { save(); } catch (error) {
      record.notifications = previous;
      throw error;
    }
    const task = (async () => {
      const results = await Promise.allSettled(channels.map(async channel => {
        record.notifications[channel] = await sendConfirmation(channel, record, env, fetchImpl);
        save();
      }));
      const failedSave = results.find(result => result.status === 'rejected');
      if (failedSave) throw failedSave.reason;
    })();
    pending.set(record.registration.id, task);
    try { await task; } finally { pending.delete(record.registration.id); }
  };

  return async function register(body) {
    const input = validatePayload(body);
    const fingerprint = JSON.stringify({ event: input.event, registration: input.registration });
    const existing = records.find(record => record.registration.id === input.requestId ||
      (record.event.id === input.event.id && record.registration.email === input.registration.email));
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw fail(409, 'This email is already registered for the event, or the request details changed. Please contact the organizer.');
      if (pending.has(existing.registration.id)) await pending.get(existing.registration.id);
      const config = notificationConfig(env);
      const skippedChannels = ['email', 'sms'].filter(channel =>
        existing.notifications[channel]?.status === 'not_configured' && config[channel]
      );
      // Only messages never attempted due to missing setup can be sent on resubmission.
      // Accepted/failed/uncertain attempts still require the organizer to check delivery first.
      await sendNotifications(existing, skippedChannels);
      return publicResult(existing, true);
    }

    const now = Date.now();
    const recent = records.filter(record => now - Date.parse(record.registration.registeredAt) < 86400000);
    const dailyLimit = Number(env.MAX_REGISTRATIONS_PER_DAY || 100);
    if (!Number.isInteger(dailyLimit) || dailyLimit < 1) throw fail(503, 'Registration service is unavailable.');
    if (recent.length >= dailyLimit || recent.filter(record =>
      record.registration.email === input.registration.email || record.registration.phone === input.registration.phone
    ).length >= 5) throw fail(429, 'Registration limit reached. Please try again later or contact the organizer.');

    const config = notificationConfig(env);
    const record = {
      fingerprint,
      event: input.event,
      registration: { ...input.registration, id: input.requestId, registeredAt: new Date(now).toISOString() },
      notifications: Object.fromEntries(['email', 'sms'].map(channel => [channel, { status: 'not_configured' }])),
    };
    records.push(record);
    try { save(); } catch (error) {
      records.pop();
      throw error;
    }

    await sendNotifications(record, ['email', 'sms'].filter(channel => config[channel]));
    return publicResult(record);
  };
}

export function createRegistrationHandler(options = {}) {
  const register = createRegistrationService(options);
  const env = options.env || process.env;
  for (const [channel, missing] of Object.entries(missingNotificationSettings(env))) {
    if (missing.length) console.warn(`${channel.toUpperCase()} confirmations are disabled. Set ${missing.join(', ')} in .env and restart the server.`);
  }
  const limits = new Map();
  return async (req, res, next = () => { res.writeHead(404); res.end(); }) => {
    if (req.url?.split('?')[0] !== '/api/registrations') return next();
    const reply = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(body));
    };
    try {
      if (req.method !== 'POST') throw fail(405, 'Use POST to register.');
      const origin = req.headers.origin;
      const allowed = env.APP_ORIGIN ? origin === env.APP_ORIGIN : /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
      if (!allowed || req.headers['x-requested-with'] !== 'CampusPlus') throw fail(403, 'Registration requests must come from this website.');
      if (!req.headers['content-type']?.startsWith('application/json')) throw fail(415, 'Send registration details as JSON.');

      const now = Date.now();
      for (const [key, entry] of limits) if (entry.until <= now) limits.delete(key);
      // Do not trust arbitrary X-Forwarded-For headers.
      const ip = req.socket.remoteAddress;
      const entry = limits.get(ip) || { count: 0, until: now + 60000 };
      limits.set(ip, entry);
      if (++entry.count > 10) throw fail(429, 'Too many requests. Please wait a minute.');

      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size <= 8192) chunks.push(chunk);
      }
      if (size > 8192) throw fail(413, 'Registration details are too large.');
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { throw fail(400, 'Invalid registration details.'); }
      const result = await register(body);
      reply(result.replayed ? 200 : 201, result);
    } catch (error) {
      if (!error.status) console.error('Registration storage error:', error.code || error.name);
      reply(error.status || 500, { error: error.status ? error.message : 'Could not confirm registration. Please try again with the same details.' });
    }
  };
}
