import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { createServer } from 'node:http';
import { createRegistrationService, createRegistrationHandler } from './registrations.js';
import { normalizePhone } from '../src/lib/registration.js';

const credentials = {
  RESEND_API_KEY: 'test-email-key', EMAIL_FROM: 'Campus+ <events@example.com>',
  TWILIO_ACCOUNT_SID: 'AC' + 'a'.repeat(32), TWILIO_AUTH_TOKEN: 'test-sms-token',
  TWILIO_FROM_NUMBER: '+15005550006',
};
const payload = () => ({
  requestId: randomUUID(),
  event: { id: 'test-event', name: 'Campus Coding', date: '2026-10-01', time: '09:30', venue: 'Main Hall' },
  registration: { name: 'Test Attendee', email: 'test@example.com', college: 'Test College', year: '2nd Year', phone: '9876543210' },
});
const response = (data, status = 200) => new Response(JSON.stringify(data), { status });
function dataFile(t) {
  const folder = mkdtempSync(join(tmpdir(), 'campus-registration-test-'));
  t.after(() => {
    assert.ok(resolve(folder).startsWith(resolve(tmpdir()) + sep + 'campus-registration-test-'));
    rmSync(folder, { recursive: true, force: true });
  });
  return join(folder, 'registrations.json');
}
function setup(t, overrides = {}) {
  const file = dataFile(t);
  const calls = [];
  const options = {
    dataFile: file, env: credentials,
    fetchImpl: async (url, request) => {
      // Provider requests must only start after a durable registration exists.
      assert.ok(JSON.parse(readFileSync(file, 'utf8')).length > 0);
      calls.push({ url, request });
      return response(url.includes('resend') ? { id: 'email-provider-id' } : { sid: 'sms-provider-id', status: 'queued' });
    },
    ...overrides,
  };
  return { register: createRegistrationService(options), calls, file, options };
}

test('normalizes Indian and international numbers and rejects invalid mobile numbers', () => {
  assert.equal(normalizePhone('98765 43210'), '+919876543210');
  assert.equal(normalizePhone('+91 (98765) 43210'), '+919876543210');
  assert.equal(normalizePhone('919876543210'), '+919876543210');
  assert.equal(normalizePhone('+1 202-555-0100'), '+12025550100');
  for (const phone of ['123', 'abcdefghij', '+911234567890', '+91987654321000', '']) {
    assert.equal(normalizePhone(phone), '');
  }
});

test('saves first, submits correct email and SMS, and keeps provider data private', async t => {
  const { register, calls, file } = setup(t);
  const body = payload();
  body.registration.email = ' Test@Example.com ';
  const result = await register(body);
  assert.equal(result.registration.email, 'test@example.com');
  assert.equal(result.registration.phone, '+919876543210');
  assert.equal(result.registration.notifications.email.status, 'accepted');
  assert.equal(result.registration.notifications.sms.status, 'accepted');
  assert.equal(calls.length, 2);
  const email = calls.find(call => call.url.includes('resend'));
  const mailBody = JSON.parse(email.request.body);
  assert.deepEqual(mailBody.to, ['test@example.com']);
  for (const value of ['Campus Coding', '2026-10-01', '09:30', 'Main Hall', body.requestId]) {
    assert.ok(mailBody.text.includes(value));
  }
  assert.equal(email.request.headers['Idempotency-Key'], `registration/${body.requestId}`);
  const sms = new URLSearchParams(calls.find(call => call.url.includes('twilio')).request.body);
  assert.equal(sms.get('To'), '+919876543210');
  assert.equal(sms.get('From'), credentials.TWILIO_FROM_NUMBER);
  assert.ok(sms.get('Body').includes('Campus Coding'));
  assert.ok(!JSON.stringify(result).includes('provider-id'));
  assert.ok(!JSON.stringify(result).includes(credentials.TWILIO_AUTH_TOKEN));
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).length, 1);
});

test('supports Twilio Messaging Service sender', async t => {
  const { register, calls } = setup(t, { env: { ...credentials, TWILIO_MESSAGING_SERVICE_SID: 'MGtest' } });
  await register(payload());
  const sms = new URLSearchParams(calls.find(call => call.url.includes('twilio')).request.body);
  assert.equal(sms.get('MessagingServiceSid'), 'MGtest');
  assert.equal(sms.has('From'), false);
});

test('missing credentials save registration without fake delivery success', async t => {
  const { register, calls } = setup(t, { env: {} });
  const result = await register(payload());
  assert.equal(result.registration.notifications.email.status, 'not_configured');
  assert.equal(result.registration.notifications.sms.status, 'not_configured');
  assert.equal(calls.length, 0);
});

test('provider failures are independent and timeout outcomes are uncertain', async t => {
  for (const failingChannel of ['email', 'sms']) {
    for (const mode of ['rejected', 'timeout', 'server-error']) {
      await t.test(`${failingChannel}: ${mode}`, async child => {
        let attempts = 0;
        const { register } = setup(child, { fetchImpl: async url => {
          attempts++;
          const channel = url.includes('resend') ? 'email' : 'sms';
          if (channel === failingChannel) {
            if (mode === 'timeout') throw new DOMException('Timed out', 'TimeoutError');
            return response({ message: 'private provider error' }, mode === 'rejected' ? 401 : 503);
          }
          return response(channel === 'email' ? { id: 'email-id' } : { sid: 'sms-id' });
        } });
        const result = await register(payload());
        assert.equal(attempts, 2);
        assert.equal(result.registration.notifications[failingChannel].status, mode === 'rejected' ? 'failed' : 'unknown');
        assert.equal(result.registration.notifications[failingChannel === 'email' ? 'sms' : 'email'].status, 'accepted');
        assert.ok(!JSON.stringify(result).includes('private provider error'));
      });
    }
  }
});

test('concurrent requests and retries after restart do not send duplicates', async t => {
  const { register, calls, options } = setup(t);
  const body = payload();
  const [first, second] = await Promise.all([register(body), register(body)]);
  assert.equal(calls.length, 2);
  assert.equal(first.registration.id, second.registration.id);
  assert.equal(second.replayed, true);
  const restarted = createRegistrationService(options);
  const replay = await restarted({ ...body, requestId: randomUUID() });
  assert.equal(replay.registration.id, body.requestId);
  assert.equal(replay.replayed, true);
  assert.equal(calls.length, 2);
});

test('restarted in-flight SMS becomes unknown and is not resent', async t => {
  const { register, calls, options, file } = setup(t);
  const body = payload();
  await register(body);
  const records = JSON.parse(readFileSync(file, 'utf8'));
  records[0].notifications.sms = { status: 'sending' };
  writeFileSync(file, JSON.stringify(records));
  const result = await createRegistrationService(options)(body);
  assert.equal(result.registration.notifications.sms.status, 'unknown');
  assert.equal(calls.length, 2);
});

test('rejects changed details for an already registered email', async t => {
  const { register, calls } = setup(t);
  const body = payload();
  await register(body);
  body.registration.phone = '9876543211';
  await assert.rejects(register(body), { status: 409 });
  assert.equal(calls.length, 2);
});

test('invalid inputs never reach either provider', async t => {
  const { register, calls } = setup(t);
  for (const invalid of [null, {}, { ...payload(), requestId: 'bad' }]) {
    await assert.rejects(register(invalid), { status: 400 });
  }
  for (const [key, value] of [['name', '   '], ['email', 'bad-email'], ['phone', '123'], ['year', 'invalid'], ['college', 'Line\nbreak']]) {
    const body = payload(); body.registration[key] = value;
    await assert.rejects(register(body), { status: 400 });
  }
  const badEvent = payload(); badEvent.event.time = '25:90';
  await assert.rejects(register(badEvent), { status: 400 });
  assert.equal(calls.length, 0);
});

test('recipient and global limits prevent additional provider calls', async t => {
  const { register, calls } = setup(t);
  for (let i = 0; i < 5; i++) {
    const body = payload(); body.event.id = `event-${i}`;
    await register(body);
  }
  await assert.rejects(register(payload()), { status: 429 });
  assert.equal(calls.length, 10);
  const global = setup(t, { env: { ...credentials, MAX_REGISTRATIONS_PER_DAY: '1' } });
  await global.register(payload());
  const other = payload(); other.registration.email = 'other@example.com'; other.registration.phone = '9876543212';
  await assert.rejects(global.register(other), { status: 429 });
  assert.equal(global.calls.length, 2);
});

test('HTTP API validates origin, content, size and method and returns saved status', async t => {
  const server = createServer(createRegistrationHandler({ env: {}, dataFile: dataFile(t) }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const url = `http://127.0.0.1:${server.address().port}/api/registrations`;
  const headers = { Origin: 'http://localhost:5173', 'Content-Type': 'application/json', 'X-Requested-With': 'CampusPlus' };
  const body = JSON.stringify(payload());
  const post = (options = {}) => fetch(url, { method: 'POST', headers, body, ...options });
  assert.equal((await post({ headers: { ...headers, Origin: 'https://untrusted.example' } })).status, 403);
  assert.equal((await post({ headers: { ...headers, 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal((await post({ body: '{' })).status, 400);
  assert.equal((await post({ body: JSON.stringify({ padding: 'x'.repeat(9000) }) })).status, 413);
  const saved = await post();
  assert.equal(saved.status, 201);
  assert.equal((await saved.json()).registration.notifications.sms.status, 'not_configured');
  assert.equal((await post()).status, 200);
  assert.equal((await fetch(url)).status, 405);
  assert.equal((await fetch(url.replace('/registrations', '/missing'))).status, 404);
  for (let i = 0; i < 6; i++) await post();
  assert.equal((await post()).status, 429);
});

test('after SMS setup, resubmitting an existing registration sends only its skipped SMS once', async t => {
  const initial = setup(t, { env: { RESEND_API_KEY: credentials.RESEND_API_KEY, EMAIL_FROM: credentials.EMAIL_FROM } });
  const body = payload();
  const first = await initial.register(body);
  assert.equal(first.registration.notifications.email.status, 'accepted');
  assert.equal(first.registration.notifications.sms.status, 'not_configured');
  assert.equal(initial.calls.length, 1);
  const restarted = createRegistrationService({ ...initial.options, env: credentials });
  const [retried, duplicate] = await Promise.all([
    restarted({ ...body, requestId: randomUUID() }),
    restarted({ ...body, requestId: randomUUID() }),
  ]);
  assert.equal(retried.registration.id, body.requestId);
  assert.equal(duplicate.registration.id, body.requestId);
  assert.equal(retried.registration.notifications.sms.status, 'accepted');
  assert.equal(initial.calls.length, 2);
  assert.ok(initial.calls[1].url.includes('twilio'));
  assert.equal(JSON.parse(readFileSync(initial.file, 'utf8')).length, 1);
  await restarted(body);
  assert.equal(initial.calls.length, 2);
});

test('repeated registrations without settings make no provider requests, including whitespace values', async t => {
  const { register, calls } = setup(t, { env: Object.fromEntries(Object.keys(credentials).map(key => [key, '   '])) });
  const body = payload();
  for (let i = 0; i < 3; i++) {
    const result = await register(body);
    assert.equal(result.registration.notifications.sms.status, 'not_configured');
    assert.equal(result.registration.notifications.email.status, 'not_configured');
  }
  assert.equal(calls.length, 0);
});

test('resubmission never retries a failed or uncertain message', async t => {
  for (const code of [401, 503]) {
    let attempts = 0;
    const fixture = setup(t, { fetchImpl: async url => {
      attempts++;
      return url.includes('twilio') ? response({ code: 20003, message: 'private' }, code) : response({ id: 'email-id' });
    } });
    const body = payload();
    const result = await fixture.register(body);
    assert.equal(result.registration.notifications.sms.status, code === 401 ? 'failed' : 'unknown');
    await createRegistrationService(fixture.options)(body);
    assert.equal(attempts, 2);
  }
});
