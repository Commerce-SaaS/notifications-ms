export const MAILER_PATTERNS = {
  FORGOT_PASSWORD_SAAS: 'forgot_password.saas',
  VERIFY_EMAIL_SAAS: 'verify_email.saas',
  EMAIL_CHANGED_SAAS: 'saas_mailer_email_changed',

  FORGOT_PASSWORD_CUSTOMER: 'forgot_password.customer',
  VERIFY_EMAIL_CUSTOMER: 'verify_email.customer',
  EMAIL_CHANGED_CUSTOMER: 'customer_mailer_email_changed',
} as const;
