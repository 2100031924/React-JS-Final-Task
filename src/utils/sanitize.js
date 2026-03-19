const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:\s*text\/html/gi,
  /vbscript:/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
  /import\s*\(/gi,
  /require\s*\(/gi,
  /eval\s*\(/gi,
  /Function\s*\(/gi,
];

export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  let sanitized = input.trim();
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  return sanitized;
}

export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return '';
  return trimmed;
}

export function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d+\-\s()]/g, '').trim();
}

export function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

export function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function validatePassword(password) {
  const result = {
    isValid: false,
    strength: 0,
    label: '',
    color: '',
    checks: {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
      noCommonPatterns: !/(123|abc|password|qwerty|admin|letmein)/i.test(password),
    },
  };

  const passedChecks = Object.values(result.checks).filter(Boolean).length;
  result.strength = passedChecks;
  result.isValid = passedChecks >= 4;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981'];
  result.label = labels[Math.min(passedChecks, 5)];
  result.color = colors[Math.min(passedChecks, 5)];

  return result;
}

export function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function setCSRFToken() {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
}

export function getCSRFToken() {
  return sessionStorage.getItem('csrf_token') || '';
}
