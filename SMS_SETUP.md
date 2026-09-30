# Phone par event registration SMS ka setup

Abhi SMS na aane ka reason: Twilio account/credentials configured nahi hain. Saved registration ka SMS status `not_configured` hai. Project ki `.env` file ready hai; usme real account details bharni hain.

## 1. Twilio account banao

[Twilio signup](https://www.twilio.com/try-twilio) par apne email aur phone se account banao aur verification complete karo. [Official account setup](https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account).

## 2. Apne phone par trial SMS check karo

Console mein **Messaging > SMS > Try out SMS** kholo. Apna phone verify karke guided flow se test message bhejo. [Official SMS quickstart](https://www.twilio.com/docs/messaging/quickstart).

Naye trial accounts predefined message templates aur verified recipients tak limited hain. Is app ka apne event name/date/venue wala SMS custom content hai, isliye iske liye upgraded account chahiye. Upgrade paid hai; Twilio ke charges dekhkar khud decide karo. [Current trial restrictions](https://www.twilio.com/docs/usage/trials).

## 3. App ke liye SMS sender aur credentials lo

Upgraded account mein SMS-capable sender number configure karo, ya sender pool ke saath Messaging Service use karo. Recipient country ke liye Messaging Geographic Permissions check karo. Indian numbers ke liye [Twilio India SMS guidance](https://www.twilio.com/en-us/guidelines/in/sms) dekho.

Console home page se **Account SID** aur **Auth Token** lo. Live credentials use karo: test credentials actual handset par SMS nahi bhejte. [Test credentials ka behavior](https://www.twilio.com/docs/iam/test-credentials).

## 4. Local .env file bharo

`club-event-manager/.env` mein ye values bharo; Auth Token chat mein mat bhejo:

```dotenv
TWILIO_ACCOUNT_SID=your_real_account_sid
TWILIO_AUTH_TOKEN=your_real_auth_token
TWILIO_FROM_NUMBER=your_twilio_sender_number_with_country_code
```

`TWILIO_FROM_NUMBER` Twilio ka sender number hai, aapka personal mobile nahi. Apna mobile event ke registration form mein daalo. Agar Messaging Service use kar rahe ho to `TWILIO_FROM_NUMBER` ki jagah `TWILIO_MESSAGING_SERVICE_SID` bharo.

Ye file gitignored hai. Placeholders ki jagah actual values chahiye; file bana dene se SMS active nahi hota.

## 5. Check karo, restart karo, registration dobara submit karo

Project folder ke terminal mein:

```sh
npm run check:notifications -- sms
```

Ye command missing settings batata hai; real SMS send ya delivery verify nahi karta. Settings bharne ke baad existing server ko Ctrl+C se roko aur:

```sh
npm run dev
```

Wahi event aur bilkul wahi attendee details dobara submit karo. Pehle `not_configured` hone se skip hua SMS ab attempt hoga; registration duplicate nahi hogi. Already attempted SMS automatically resend nahi hota. SMS ke provider ne request accept ki ho to UI `Accepted for delivery` dikhayegi; phone tak delivery ka final status Twilio Console mein dekho.

Agar request reject ho to server terminal mein HTTP status/provider error code dikhega. Actual error ka detail Twilio dashboard se mil sakta hai. Credentials ya token share mat karo.

Email ke liye alag se `.env` mein `RESEND_API_KEY` aur `EMAIL_FROM` bhi configure karne hain; [README](README.md) mein email setup hai.
