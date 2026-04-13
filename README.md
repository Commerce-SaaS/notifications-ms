# 🧩 Notifications Microservice

A modern, event-driven email notification microservice built with **NestJS** and **RabbitMQ**. This service is responsible for handling all email-related notifications within the SaaS system, including user account verification and password reset communications. It operates as a message consumer, processing events from a RabbitMQ queue and delivering professional, templated emails to users.

---

## 🏗️ Architecture

The Notifications Microservice follows a **microservice architecture** pattern with the following characteristics:

- **Event-Driven**: Consumes events from RabbitMQ message queue
- **Message Pattern-Based**: Implements named event patterns for different notification types
- **Service Layer Pattern**: Separates business logic from transport concerns
- **Template Engine**: Uses Handlebars for dynamic email template rendering
- **Error Handling**: Centralized RPC exception handling for consistent error responses

### Communication Flow

```
External Service → RabbitMQ Queue → Notifications MS → SMTP Server → User Email
```

**Key Design Principles:**
- Single responsibility: Handles email notifications only
- Decoupled communication: Asynchronous message-based integration
- Scalable: Can handle multiple concurrent email sends
- Resilient: Graceful error handling with detailed logging

---

## ⚙️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | Latest LTS |
| **Framework** | NestJS | ^11.0.1 |
| **Language** | TypeScript | ^5.7.3 |
| **Message Queue** | RabbitMQ (AMQP) | Protocol: amqp(s) |
| **Client Library** | amqplib | ^0.10.9 |
| **Email Service** | Nodemailer | ^7.0.12 |
| **Mailer Module** | @nestjs-modules/mailer | ^2.0.2 |
| **Template Engine** | Handlebars | ^4.7.8 |
| **Validation** | Zod | ^4.2.1 |
| **Testing** | Jest | ^29.7.0 |
| **Linting** | ESLint | ^9.18.0 |
| **Formatting** | Prettier | ^3.4.2 |

---

## 📁 Project Structure

```
src/
├── app.module.ts                    # Root application module
├── main.ts                          # Application bootstrap & RabbitMQ configuration
│
├── common/
│   └── helpers/
│       └── rpc-exception.helper.ts  # Centralized RPC exception handling
│
├── config/
│   ├── envs.ts                      # Environment variables validation (Zod schema)
│   ├── index.ts                     # Config exports
│   ├── services.ts                  # Service constants
│   └── transports/
│       └── rabbitmq.module.ts       # RabbitMQ transport configuration
│
├── custom-mailer/
│   ├── custom-mailer.controller.ts  # Message pattern handlers
│   ├── custom-mailer.module.ts      # Module with NestJS Mailer configuration
│   ├── custom-mailer.service.ts     # Email sending logic
│   ├── patterns/
│   │   └── mailer_patterns.ts       # RabbitMQ event pattern constants
│   └── templates/
│       ├── forgot-password.hbs      # Password reset email template
│       └── verify-email.hbs         # Email verification template
│
└── types/
    └── types.ts                     # TypeScript type definitions
```

### Folder Descriptions

- **`common/`**: Shared utilities and helpers used across the microservice
- **`config/`**: Environment configuration, validation, and service constants
- **`custom-mailer/`**: Core email notification functionality
  - **`templates/`**: Handlebars email templates with styling
  - **`patterns/`**: Message pattern definitions for RabbitMQ events
- **`types/`**: Centralized TypeScript type definitions for type safety

---

## 🔌 Environment Variables

All environment variables are validated at startup using Zod schema validation. If any required variable is missing or invalid, the application will fail with descriptive error messages.

| Variable | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `NODE_ENV` | `enum` | ✅ | Application environment | - |
| `PORT` | `number` | ❌ | Service port for logging/monitoring | `3000` |
| `RABBITMQ_URL` | `string` | ✅ | RabbitMQ connection URL (must start with `amqp://` or `amqps://`) | - |
| `RMQ_EVENTS_QUEUE` | `string` | ✅ | RabbitMQ queue name for consuming events | - |
| `SMTP_HOST` | `string` | ✅ | SMTP server hostname | - |
| `SMTP_PORT` | `number` | ❌ | SMTP server port | `465` |
| `SMTP_USER` | `string` | ✅ | SMTP authentication username | - |
| `SMTP_PASS` | `string` | ✅ | SMTP authentication password | - |
| `SMTP_FROM` | `string` | ✅ | Default sender email address | - |

### Example `.env` File

```env
NODE_ENV=production
PORT=3000
RABBITMQ_URL=amqps://user:password@rabbitmq-host:5671
RMQ_EVENTS_QUEUE=notifications-events
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=no-reply@yourapp.com
SMTP_PASS=your_smtp_app_password
SMTP_FROM=YourApp <no-reply@yourapp.com>
```

---

## 🚀 Installation & Running

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **RabbitMQ** server (local or remote)
- **SMTP** credentials (Gmail, SendGrid, custom SMTP server, etc.)

### Installation

```bash
# Install dependencies
npm install

# or with yarn
yarn install
```

### Running the Service

```bash
# Development mode with auto-reload
npm run start:dev

# Production build
npm run build

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

### Verification

Once running, you should see:

```
[Nest] <date> - <time>    LOG [Notifications MS] Notifications Microservice is running on port 3000
```

This indicates the service is successfully:
- Connected to RabbitMQ
- Listening for message events
- Ready to process notifications

---

## 📡 API Endpoints (RabbitMQ Message Patterns)

This microservice is **not** a traditional REST API. Instead, it operates on **event-driven message patterns** consumed from RabbitMQ. External services publish events to the RabbitMQ queue, and this microservice processes them asynchronously.

### Message Patterns

| Pattern | Event Name | Payload | Purpose |
|---------|-----------|---------|---------|
| `forgot_password` | Password Reset Request | `{ email: string; resetUrl: string }` | Sends password reset email with reset link |
| `verify_email` | Email Verification | `{ email: string; verifyUrl: string }` | Sends account verification email with confirmation link |

### Example: Publishing Events from Another Service

```typescript
// Example in another microservice using @nestjs/microservices

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('NOTIFICATIONS_SERVICE') private client: ClientProxy) {}

  async sendPasswordReset(email: string, resetToken: string) {
    const resetUrl = `https://yourapp.com/reset-password?token=${resetToken}`;
    
    await this.client.emit('forgot_password', {
      email,
      resetUrl,
    }).toPromise();
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    const verifyUrl = `https://yourapp.com/verify-email?token=${verificationToken}`;
    
    await this.client.emit('verify_email', {
      email,
      verifyUrl,
    }).toPromise();
  }
}
```

### Payload Specifications

#### `forgot_password` Pattern

```typescript
interface ForgotPasswordEmailData {
  email: string;        // Recipient email address
  resetUrl: string;     // Full URL to password reset page
}
```

#### `verify_email` Pattern

```typescript
interface VerifyEmailData {
  email: string;        // Recipient email address
  verifyUrl: string;    // Full URL to email verification page
}
```

---

## 🔐 Security

### Authentication & Authorization

- **No HTTP Authentication**: This is a microservice operating on RabbitMQ, not a public API
- **Queue-Level Security**: Uses RabbitMQ credentials configured in `RABBITMQ_URL`
- **TLS/SSL**: Recommended to use `amqps://` protocol for encrypted RabbitMQ connections

### Environment Secrets

- **SMTP Credentials**: Stored in environment variables, never committed to version control
- **Zod Validation**: All environment variables are validated at startup
- **RPC Exception Handler**: Ensures sensitive error details are not exposed

### Email Template Security

- **Handlebars Strict Mode**: Enabled to prevent injection attacks
- **Dynamic Content**: Links and URLs are injected safely via Handlebars context

### Best Practices

1. ✅ Use `amqps://` (TLS) for RabbitMQ connections in production
2. ✅ Store SMTP credentials in secure secret management (AWS Secrets Manager, HashiCorp Vault, etc.)
3. ✅ Limit RabbitMQ queue access to authorized services only
4. ✅ Implement rate limiting on event publishing (in consuming services)
5. ✅ Monitor email sending logs for failed deliveries

---

## 🧠 Core Logic

### Email Sending Workflow

```
1. External Service emits RabbitMQ message with pattern & payload
2. Controller receives message via @EventPattern decorator
3. Controller passes payload to Service method
4. Service calls sendTemplateEmail() helper
5. Nodemailer renders template with Handlebars
6. Email is sent via SMTP
7. Errors are caught and logged via RpcExceptionHelper
```

### Key Components

#### CustomMailerController

- Listens to RabbitMQ events using `@EventPattern`
- Two message handlers:
  - `@EventPattern(MAILER_PATTERNS.FORGOT_PASSWORD)` → `forgotPassword()`
  - `@EventPattern(MAILER_PATTERNS.VERIFY_EMAIL)` → `verifyEmail()`
- Delegates to CustomMailerService

#### CustomMailerService

- **`sendTemplateEmail()`**: Internal helper method
  - Accepts: `to`, `subject`, `template`, `context`
  - Renders Handlebars template with dynamic context
  - Sends email via Nodemailer
  - Catches and handles errors gracefully

- **`forgotPassword()`**: Public method
  - Prepares context with `resetLink` and `year`
  - Calls `sendTemplateEmail()` with `forgot-password` template

- **`verifyEmail()`**: Public method
  - Prepares context with `verifyLink` and `year`
  - Calls `sendTemplateEmail()` with `verify-email` template

#### Error Handling

- All errors are caught and converted to `RpcException` via `RpcExceptionHelper`
- Errors are logged to console with template context
- Prevents sensitive error information from leaking

### Template Rendering

Handlebars templates support dynamic variables:

```handlebars
<a href="{{resetLink}}" class="button">Reset your password</a>
<p>&copy; {{year}} YourApp. All rights reserved.</p>
```

The `year` is automatically injected for copyright footers.

---

## 🔄 Integrations

### External Services Integration

This microservice integrates with the following external systems:

#### 1. **RabbitMQ**

- **Type**: Message Queue / Event Bus
- **Protocol**: AMQP (amqp:// or amqps://)
- **Role**: Receives notification events from other microservices
- **Configuration**: Defined in `main.ts`
- **Reliability**: Queue is configured as `durable: true` to persist messages

#### 2. **SMTP Server**

- **Type**: Email Service Provider
- **Role**: Delivers emails to recipients
- **Configuration**: SMTP host, port, credentials in `envs.ts`
- **Options**: Compatible with:
  - Gmail (smtp.gmail.com:465)
  - SendGrid (smtp.sendgrid.net:465)
  - AWS SES (email-smtp.region.amazonaws.com:465)
  - Custom SMTP servers

#### 3. **Other Microservices**

- Publish events to RabbitMQ queue with patterns defined in `MAILER_PATTERNS`
- Examples: `auth-ms` (for forgot-password), `users-ms` (for verify-email)

### Integration Flow

```
┌─────────────────────┐
│  Auth Microservice  │
│  - Forgot Password  │
│  - Email Reset Link │
└──────────┬──────────┘
           │
           │ Emit: { forgot_password, {email, resetUrl} }
           ▼
    ┌─────────────┐
    │ RabbitMQ    │
    │ Queue Name: │
    │ notifications-events
    └──────┬──────┘
           │
           │ Consume
           ▼
┌──────────────────────────┐
│ Notifications MS         │
│ - CustomMailerService    │
│ - Handlebars Templates   │
└──────────┬───────────────┘
           │
           │ Send Email
           ▼
┌──────────────────────────┐
│ SMTP Server              │
│ (Gmail, SendGrid, etc.)  │
└──────────┬───────────────┘
           │
           ▼ Email Delivery
        User Email
```

---

## 🧪 Testing

### Available Test Commands

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Debug tests
npm run test:debug

# Run e2e tests
npm run test:e2e
```

### Test Configuration

- **Framework**: Jest
- **Root Directory**: `src/`
- **Test Pattern**: `*.spec.ts`
- **Coverage Directory**: `coverage/`
- **Transform**: ts-jest

### Testing Microservices

When testing RabbitMQ-based microservices, consider:

1. **Unit Tests**: Test individual services and controllers in isolation
2. **Integration Tests**: Mock RabbitMQ and SMTP to test message flow
3. **Contract Tests**: Ensure message payloads match expected interfaces

---

## 🛠️ Development & Maintenance

### Code Quality

```bash
# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint
```

### Build & Deployment

```bash
# Build for production
npm run build

# Output is generated in dist/ folder
# Dockerfile available for containerization
```

### Logging

The microservice logs important events to stdout:

- Application startup
- RabbitMQ connection status
- Email sending attempts
- Errors and exceptions

Example logs:
```
[Nest] 2026-04-13T10:30:00.123Z    LOG [Notifications MS] Notifications Microservice is running on port 3000
[Nest] 2026-04-13T10:30:05.456Z    LOG [CustomMailerService] Email sent to user@example.com
```

### Monitoring

Key metrics to monitor in production:

- **Queue Depth**: Messages pending in RabbitMQ queue
- **Email Delivery Rate**: Percentage of successful email sends
- **Error Rate**: Failed email sends
- **Response Time**: Average time to process and send email
- **Memory Usage**: Memory consumption of the Node.js process
- **Connection Status**: RabbitMQ and SMTP connection health

---

## 📌 Additional Notes

### Production Deployment

1. **Use amqps:// (TLS)** for RabbitMQ connections
2. **Configure SMTP with TLS/SSL** for secure email transmission
3. **Set NODE_ENV=production** for optimized performance
4. **Use environment variable management** (AWS Secrets Manager, HashiCorp Vault)
5. **Implement health checks** for monitoring and auto-recovery
6. **Use PM2 or similar** for process management

### Email Template Customization

To add new email templates:

1. Create a new `.hbs` file in `src/custom-mailer/templates/`
2. Add a new pattern constant in `src/custom-mailer/patterns/mailer_patterns.ts`
3. Create a new event handler method in `src/custom-mailer/custom-mailer.controller.ts`
4. Implement corresponding service method in `src/custom-mailer/custom-mailer.service.ts`
5. Define TypeScript interface in `src/types/types.ts`

### Scaling Considerations

- **Horizontal Scaling**: Run multiple instances consuming from the same RabbitMQ queue
- **Connection Pooling**: RabbitMQ connection manager handles connection efficiency
- **Queue Priorities**: Configure RabbitMQ queue priorities for critical emails

### Common Issues & Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Connection refused to RabbitMQ** | Invalid `RABBITMQ_URL` or RabbitMQ not running | Verify RabbitMQ is running and URL is correct |
| **SMTP authentication failed** | Invalid SMTP credentials | Check `SMTP_USER` and `SMTP_PASS` in environment |
| **Emails not being sent** | Queue name mismatch or service not listening | Verify `RMQ_EVENTS_QUEUE` matches publisher's queue |
| **Template not found error** | Template path incorrect in production | Ensure templates are copied to dist/ during build |
| **Memory usage increasing** | Connection leaks or unbounded message queue | Restart service and monitor message backlog |

### Documentation References

- [NestJS Microservices Docs](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Nodemailer Docs](https://nodemailer.com/)
- [Handlebars Documentation](https://handlebarsjs.com/)
- [Zod Validation Docs](https://zod.dev/)

---

## 📋 License

UNLICENSED - Proprietary

---

## 👥 Support

For issues, questions, or contributions related to this microservice, please contact the development team or refer to the organization's internal documentation.

**Last Updated**: April 13, 2026
**Microservice Version**: 0.0.1
**NestJS Version**: ^11.0.1
