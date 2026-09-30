export function missingNotificationSettings(env) {
  const present = key => Boolean(env[key]?.trim());
  return {
    email: ['RESEND_API_KEY', 'EMAIL_FROM'].filter(key => !present(key)),
    sms: [
      ...['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'].filter(key => !present(key)),
      ...(!present('TWILIO_MESSAGING_SERVICE_SID') && !present('TWILIO_FROM_NUMBER')
        ? ['TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID'] : []),
    ],
  };
}

export function notificationConfig(env) {
  const missing = missingNotificationSettings(env);
  return { email: missing.email.length === 0, sms: missing.sms.length === 0 };
}

// A provider accepting a request is not proof that it reached an inbox or phone.
export async function sendConfirmation(channel, record, env, fetchImpl = fetch) {
  if (!notificationConfig(env)[channel]) return { status: 'not_configured' };
  const { event, registration } = record;
  const details = `${event.name} on ${event.date} at ${event.time}, ${event.venue}`;
  let url;
  let options;
  if (channel === 'email') {
    url = 'https://api.resend.com/emails';
    options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `registration/${registration.id}`,
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [registration.email],
        subject: `Registration confirmed: ${event.name}`,
        text: `Hi ${registration.name},\n\nYour registration is confirmed!\n\nEvent: ${event.name}\nDate: ${event.date}\nTime: ${event.time}\nVenue: ${event.venue}\nRegistration ID: ${registration.id}\n\nSee you there!\nCampus+`,
      }),
    };
  } else {
    url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(env.TWILIO_ACCOUNT_SID)}/Messages.json`;
    const body = new URLSearchParams({
      To: registration.phone,
      Body: `Campus+: Hi ${registration.name}, your registration for ${details} is confirmed. Ref: ${registration.id}`,
    });
    if (env.TWILIO_MESSAGING_SERVICE_SID) body.set('MessagingServiceSid', env.TWILIO_MESSAGING_SERVICE_SID);
    else body.set('From', env.TWILIO_FROM_NUMBER);
    options = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    };
  }

  try {
    const response = await fetchImpl(url, { ...options, signal: AbortSignal.timeout(12000) });
    if (!response.ok) {
      // Keep useful diagnostics on the server without logging tokens, recipients or raw bodies.
      const failure = await response.json().catch(() => ({}));
      const code = Number.isInteger(failure?.code) ? `, provider code ${failure.code}` : '';
      console.warn(`${channel.toUpperCase()} confirmation failed: HTTP ${response.status}${code}. Check the provider dashboard.`);
      return { status: response.status >= 500 ? 'unknown' : 'failed' };
    }
    const result = await response.json();
    if (channel === 'sms' && ['failed', 'undelivered', 'canceled'].includes(result.status)) {
      return { status: 'failed' };
    }
    const providerId = channel === 'email' ? result.id : result.sid;
    return providerId ? { status: 'accepted', providerId } : { status: 'unknown' };
  } catch {
    // A timeout may happen after the provider accepted the message. Do not resend blindly.
    return { status: 'unknown' };
  }
}
