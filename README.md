# Campus+ event registration

Registering saves the registration on the Node server, then submits an email through Resend and an SMS through Twilio. The form and admin registration table show each channel's status separately. A message failure does not cancel registration.

## Run locally

Use Node.js 22.12+ and install the existing dependencies with `npm install`.

1. Copy `.env.example` to `.env` in this folder.
2. Fill in the provider settings below. These are **server-only secrets**; never prefix them with `VITE_` or put them in React code.
3. Run `npm run dev`. Vite starts both the frontend and the registration API in one process. Restart it after changing `.env`.
4. Open an event and register with your own email and mobile number. Indian 10-digit mobile numbers automatically get `+91`; other countries require a country code.

Without credentials, registration still saves, but the UI explicitly shows that email/SMS is unavailable. It does not pretend messages were sent. Fill in .env and run `npm run check:notifications` to list missing settings without revealing secrets. After adding credentials and restarting the server, resubmit the same event registration details: confirmations skipped because setup was missing will be sent. Already attempted messages will not be resent.

## Email setup

- Create a Resend API key and set `RESEND_API_KEY`.
- Verify your sender domain and set `EMAIL_FROM`, for example `Campus+ <events@yourdomain.com>`.
- The confirmation includes the attendee's name, event, date, time, venue and registration reference.

Provider instructions: [verify a domain](https://resend.com/docs/dashboard/domains/introduction), [send email API](https://resend.com/docs/api-reference/emails/send-email).

## SMS setup

Hindi step-by-step instructions: [SMS_SETUP.md](SMS_SETUP.md). Run `npm run check:notifications -- sms` to diagnose missing SMS settings.

- Set `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`.
- Set either `TWILIO_FROM_NUMBER` to an SMS-capable Twilio sender in E.164 format, or `TWILIO_MESSAGING_SERVICE_SID` to a configured Messaging Service.
- Enable the destination country in your Twilio account's messaging permissions. Current trials restrict recipients and allow predefined content only; custom event confirmations require an upgraded account. See [current trial restrictions](https://www.twilio.com/docs/usage/trials). Sender availability and destination requirements depend on your account and country; for Indian recipients check the linked guidance.

Provider instructions: [Twilio Messages API and trial restrictions](https://www.twilio.com/docs/messaging/api/message-resource), [India SMS guidance](https://www.twilio.com/en-us/guidelines/in/sms).

## Build and run

```sh
npm run build
npm start
```

`npm start` serves `dist` and `/api/registrations` together at `http://127.0.0.1:3000`. For deployment, set `APP_ORIGIN` to the exact HTTPS website origin (no trailing slash), set `HOST`/`PORT` as needed, and run behind your HTTPS proxy. A static-only host cannot run the notification API. `npm run preview` also includes the API for local build checks.

## Storage and behavior

- Registrations are written to `server/data/registrations.json` **before** contacting providers. Keep this private directory on a persistent disk and back it up; it contains attendee information. Run one server process against this file.
- Existing event editing and individual event lists still use browser localStorage. The **People Registered** tab in Admin reads the server's saved registration receipts, so it includes registrations from other browsers after a refresh. It shows names, event details, college, year and registration time; email addresses and phone numbers are not returned by that list. Event details are supplied by the existing browser event editor. Before a public multi-user deployment, move that catalog and admin authorization to the server as well.
- Duplicate submissions with the same event and attendee details return the saved registration, including after a restart. Only channels previously marked `not_configured` can be attempted once after their credentials have been added; accepted, failed or uncertain messages are not resent. Changing details for an already registered email returns a conflict. Failed or uncertain sends are not automatically retried; the organizer should inspect the provider dashboard first.
- Each provider has a 12-second timeout and is attempted independently. `Accepted for delivery` means the provider accepted the message, not confirmed inbox/handset delivery. Delivery callbacks are not implemented.
- Requests are validated and limited to 8 KB, 10 attempts per minute per directly connected IP, 5 registrations per recipient per day and 100 total per day by default. Adjust `MAX_REGISTRATIONS_PER_DAY` for your event. Behind a reverse proxy the IP limit is shared; forwarded IP headers are intentionally not trusted.
- No provider tokens or provider error bodies are returned to the browser. `.env` and private registration data are gitignored.

## Checks

```sh
npm test
npm run build
npm run lint
```

Tests mock both providers: they do not send real SMS/email or need credentials. Live delivery must be checked with configured provider accounts and your own recipient details.
