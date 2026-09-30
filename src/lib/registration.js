export const studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export function normalizePhone(value) {
  const phone = String(value ?? '').replace(/[\s()-]/g, '');
  if (/^[6-9]\d{9}$/.test(phone)) return `+91${phone}`;
  if (/^91[6-9]\d{9}$/.test(phone)) return `+${phone}`;
  if (phone.startsWith('+91') && !/^\+91[6-9]\d{9}$/.test(phone)) return '';
  if (/^\+[1-9]\d{7,14}$/.test(phone)) return phone;
  return '';
}

export function normalizeRegistration(data = {}) {
  return {
    name: String(data.name ?? '').trim(),
    email: String(data.email ?? '').trim().toLowerCase(),
    college: String(data.college ?? '').trim(),
    year: String(data.year ?? '').trim(),
    phone: normalizePhone(data.phone),
  };
}

export function registrationError(data) {
  if (!data.name || !data.email || !data.college || !data.year) return 'All fields are required.';
  if (data.name.length > 100 || data.college.length > 160) return 'Name or college is too long.';
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Please enter a valid email address.';
  }
  if (!data.phone) return 'Enter a 10-digit Indian mobile number or include your country code (for example +91).';
  if (!studyYears.includes(data.year)) return 'Please select a valid year of study.';
  if (Object.values(data).some(containsControlCharacters)) return 'Please remove line breaks from your details.';
  return '';
}

export const notificationLabels = {
  accepted: 'Accepted for delivery',
  not_configured: 'Not sent — the notification service has not been set up. Please contact the organizer.',
  failed: 'Could not be sent — please contact the organizer',
  unknown: 'Delivery status unavailable — please contact the organizer',
  sending: 'Sending confirmation…',
};

export function containsControlCharacters(value) {
  return Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);
}
