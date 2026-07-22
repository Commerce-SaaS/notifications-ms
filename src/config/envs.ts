import { z } from 'zod';
import 'dotenv/config';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().default(3000),
    RABBITMQ_URL: z.string().refine((val) => /^amqps?:\/\//.test(val), {
      message: 'RABBITMQ_URL must start with amqp:// or amqps://',
    }),
    RMQ_EVENTS_QUEUE: z.string().min(1, 'RMQ_EVENTS_QUEUE cannot be empty'),
    SMTP_HOST: z.string().min(1, 'SMTP_HOST cannot be empty'),
    SMTP_PORT: z.coerce.number().default(465),
    SMTP_USER: z.string().min(1, 'SMTP_USER cannot be empty'),
    SMTP_PASS: z.string().min(1, 'SMTP_PASS cannot be empty'),
    SMTP_FROM: z.string().min(1, 'SMTP_FROM cannot be empty'),
    LOGO_URL: z.string().min(1, 'LOGO_URL cannot be empty'),
    APP_NAME: z.string().min(1, 'APP_NAME cannot be empty'),
    APP_URL: z.string().min(1, 'APP_URL cannot be empty'),
  })
  .required();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables');
}

export const envs = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  rabbitmqUrl: parsedEnv.data.RABBITMQ_URL,
  rabbitmqEventsQueue: parsedEnv.data.RMQ_EVENTS_QUEUE,
  smtpHost: parsedEnv.data.SMTP_HOST,
  smtpPort: parsedEnv.data.SMTP_PORT,
  smtpUser: parsedEnv.data.SMTP_USER,
  smtpPass: parsedEnv.data.SMTP_PASS,
  smtpFrom: parsedEnv.data.SMTP_FROM,
  logoUrl: parsedEnv.data.LOGO_URL,
  appName: parsedEnv.data.APP_NAME,
  appUrl: parsedEnv.data.APP_URL,
};
