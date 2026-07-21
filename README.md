# 📧 Notifications Microservice (`notifications-ms`)

> NestJS microservice responsible for consuming RabbitMQ events and sending transactional emails through SMTP using Handlebars templates.

---

# 📌 Purpose

`notifications-ms` is a **message-driven NestJS microservice** responsible for handling transactional email notifications across the platform.

The service consumes events from **RabbitMQ**, processes the incoming payloads, renders dynamic templates using **Handlebars**, and sends emails through an SMTP provider.

## Main responsibilities

- 📩 Password reset emails
- ✉️ Email verification emails
- 🔄 Email change notifications
- 🏢 SaaS organization emails
- 👤 Customer emails

## Service characteristics

✅ RabbitMQ event consumer  
✅ No HTTP REST API  
✅ No database dependency  
✅ Stateless service  
✅ Handlebars-based templates  
✅ SMTP provider agnostic  

---

# 🏗️ Architecture

```
                 ┌─────────────────┐
                 │ Other Services  │
                 └────────┬────────┘
                          │
                          │ RabbitMQ Events
                          ▼
              ┌─────────────────────┐
              │   notifications-ms  │
              │                     │
              │ NestJS Microservice │
              └─────────┬───────────┘
                        │
                        │ Template Rendering
                        ▼
              ┌─────────────────────┐
              │     Handlebars      │
              │  Email Templates    │
              └─────────┬───────────┘
                        │
                        │ SMTP
                        ▼
                    📧 Email
```

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| NestJS 11 | Microservice framework |
| `@nestjs/microservices` | RabbitMQ transport |
| RabbitMQ | Event broker |
| `amqplib` | RabbitMQ client |
| `amqp-connection-manager` | RMQ connection management |
| `@nestjs-modules/mailer` | Email module |
| Nodemailer | SMTP email delivery |
| Handlebars | Email template engine |
| Zod | Environment validation |
| class-validator | DTO validation |
| class-transformer | DTO transformation |
| Jest | Testing framework |

---

# 📦 Installation

Install dependencies:

```bash
npm install
```

---

# ▶️ Running Locally

## Development mode

```bash
npm run start:dev
```

## Debug mode

```bash
npm run start:debug
```

## Production

Build:

```bash
npm run build
```

Start:

```bash
npm run start:prod
```

---

# ⚠️ Important: No HTTP API

This service does **not expose any REST API**.

It is started exclusively as a NestJS microservice:

```ts
NestFactory.createMicroservice()
```

There is:

- ❌ No HTTP controllers
- ❌ No REST endpoints
- ❌ No `app.listen()`

The `PORT` environment variable is only used for startup logging:

```
Notifications Microservice is running on port XXXX
```

It does not bind an HTTP server.

---

# 🐳 Docker

The root `docker-compose.yml` runs this service as:

```
notifications-ms

├── Container port: 4005
├── Dockerfile: EXPOSE 4005
└── Command: npm run start:dev
```

The exposed Docker port is only metadata.

The service communicates exclusively through:

```
notifications-ms
        |
        |
     RabbitMQ
```

No HTTP traffic is expected.

---

# 🧪 Testing

Available scripts:

```bash
npm run test
```

```bash
npm run test:watch
```

```bash
npm run test:cov
```

```bash
npm run test:debug
```

```bash
npm run test:e2e
```

## Current status

⚠️ Tests are not implemented yet.

Current repository state:

```
❌ No *.spec.ts files
❌ No test directory
❌ No jest-e2e.json configuration
```

The Jest scripts are currently scaffolding only.

---

# 🔐 Environment Variables

Environment variables are validated at startup using:

```
src/config/envs.ts
```

The application will fail during bootstrap if required variables are missing.

| Variable | Description | Required |
|---|---|---|
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | ✅ |
| `PORT` | Startup log only | ❌ |
| `RABBITMQ_URL` | RabbitMQ connection URL | ✅ |
| `RMQ_EVENTS_QUEUE` | RabbitMQ queue name | ✅ |
| `SMTP_HOST` | SMTP server hostname | ✅ |
| `SMTP_PORT` | SMTP server port | ❌ |
| `SMTP_USER` | SMTP username | ✅ |
| `SMTP_PASS` | SMTP password | ✅ |
| `SMTP_FROM` | Default sender email | ✅ |
| `LOGO_URL` | SaaS email logo URL | ✅ |
| `APP_NAME` | SaaS application name | ✅ |
| `APP_URL` | SaaS application URL | ✅ |

---

# Example `.env`

```env
NODE_ENV=development

RABBITMQ_URL=amqp://localhost:5672
RMQ_EVENTS_QUEUE=events.notifications

SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM=no-reply@example.com

LOGO_URL=https://example.com/logo.png
APP_NAME=My SaaS Platform
APP_URL=https://example.com
```

---

# 📨 RabbitMQ Events

Transport:

```
RabbitMQ (Transport.RMQ)
```

Configuration:

```env
RABBITMQ_URL
RMQ_EVENTS_QUEUE
```

The queue is durable:

```ts
durable: true
```

Events are consumed using:

```ts
@EventPattern()
```

These are one-way events.

No RPC response is expected.

---

# 📬 Consumed Message Patterns

Location:

```
src/custom-mailer/patterns/mailer_patterns.ts
```

Handlers:

```
src/custom-mailer/custom-mailer.controller.ts
```

| Event Pattern | Handler | Description |
|---|---|---|
| `forgot_password.saas` | `forgotPasswordSaaS` | SaaS password reset |
| `forgot_password.customer` | `forgotPasswordCustomer` | Customer password reset |
| `verify_email.saas` | `verifyEmailSaaS` | SaaS email verification |
| `verify_email.customer` | `verifyEmailCustomer` | Customer email verification |
| `saas_mailer_email_changed` | `requestEmailChangeSaaS` | SaaS email change |
| `customer_mailer_email_changed` | `requestEmailChangeCustomer` | Customer email change |

---

# ✉️ Email Templates

Templates are located at:

```
src/custom-mailer/templates/
```

Available templates:

```
forgot-password-saas.hbs
forgot-password-customer.hbs

verify-email-saas.hbs
verify-email-customer.hbs

email-changed-saas.hbs
email-changed-customer.hbs
```

---

## Template Engine

Templates are rendered using:

```ts
HandlebarsAdapter
```

Configuration:

```ts
strict: true
```

This ensures missing template variables fail fast.

---

## Template Resolution

Development:

```
src/custom-mailer/templates
```

Production:

```
dist/custom-mailer/templates
```

Selected using:

```ts
process.env.NODE_ENV === "production"
```

---

# 🔌 External Dependencies

## RabbitMQ

Required for application startup.

Used for:

- Event consumption
- Queue subscription
- Message processing

Environment:

```env
RABBITMQ_URL
RMQ_EVENTS_QUEUE
```

---

## SMTP Server

Required for sending emails.

Configuration:

```env
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
```

Any SMTP-compatible provider can be used.

Examples:

- Gmail SMTP
- Mailgun
- SendGrid SMTP
- Amazon SES SMTP
- Custom SMTP servers

---

## Database

This service does not use persistence.

Confirmed:

```
❌ No ORM
❌ No database client
❌ No migrations
❌ No database environment variables
```

---

# 📁 Project Structure

```
src
│
├── config
│   ├── envs.ts
│   └── transports
│
├── custom-mailer
│   │
│   ├── templates
│   │   ├── forgot-password-saas.hbs
│   │   ├── verify-email-saas.hbs
│   │   └── email-changed-saas.hbs
│   │
│   ├── custom-mailer.controller.ts
│   ├── custom-mailer.service.ts
│   └── patterns
│       └── mailer_patterns.ts
│
└── main.ts
```

---

# 📝 TODO

## Tests

- Add unit tests
- Add integration tests
- Add e2e tests
- Create Jest configuration

---

## Environment Example

`.env.example` is missing:

```env
LOGO_URL
APP_NAME
APP_URL
```

These variables are required by:

```
src/config/envs.ts
```

---

## Dependencies Cleanup

`ioredis` exists in `package.json` but currently:

- ❌ No imports
- ❌ No usage inside `src/`

Possible leftover dependency.

---

## RabbitMQ Module Cleanup

File:

```
src/config/transports/rabbitmq.module.ts
```

contains commented code and is currently unused.

The active RabbitMQ configuration is directly implemented in:

```
src/main.ts
```

---

## Port Configuration

Currently:

```env
PORT
```

does not represent an HTTP server.

It is only used in startup logs.

The Docker exposed port:

```
4005
```

is not bound by any HTTP listener.

---

# ✅ Service Status

| Feature | Status |
|---|---|
| RabbitMQ consumer | ✅ Implemented |
| SMTP email delivery | ✅ Implemented |
| Handlebars templates | ✅ Implemented |
| SaaS email templates | ✅ Implemented |
| Customer email templates | ✅ Implemented |
| Database | ❌ Not required |
| HTTP API | ❌ Not exposed |
| Automated tests | ⚠️ Pending |