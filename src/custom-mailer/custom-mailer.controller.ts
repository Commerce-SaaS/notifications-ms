import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CustomMailerService } from './custom-mailer.service';
import { MAILER_PATTERNS } from './patterns/mailer_patterns';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordEmailDto } from './dto/forgot-password';
import { EmailChangedDto } from './dto/email-changed.dto';

@Controller()
export class CustomMailerController {
  constructor(private readonly mailerService: CustomMailerService) {}

  @EventPattern(MAILER_PATTERNS.FORGOT_PASSWORD_SAAS)
  async forgotPasswordSaaS(@Payload() dto: ForgotPasswordEmailDto) {
    return this.mailerService.forgotPasswordSaaS(dto);
  }

  @EventPattern(MAILER_PATTERNS.FORGOT_PASSWORD_CUSTOMER)
  async forgotPasswordCustomer(@Payload() dto: ForgotPasswordEmailDto) {
    return this.mailerService.forgotPasswordCustomer(dto);
  }

  @EventPattern(MAILER_PATTERNS.VERIFY_EMAIL_SAAS)
  async verifyEmailSaaS(@Payload() dto: VerifyEmailDto) {
    return this.mailerService.verifyEmailSaaS(dto);
  }

  @EventPattern(MAILER_PATTERNS.VERIFY_EMAIL_CUSTOMER)
  async verifyEmailCustomer(@Payload() dto: VerifyEmailDto) {
    return this.mailerService.verifyEmailCustomer(dto);
  }

  @EventPattern(MAILER_PATTERNS.EMAIL_CHANGED_SAAS)
  async requestEmailChangeSaaS(@Payload() dto: EmailChangedDto) {
    return this.mailerService.requestEmailChangeSaaS(dto);
  }

  @EventPattern(MAILER_PATTERNS.EMAIL_CHANGED_CUSTOMER)
  async requestEmailChangeCustomer(@Payload() dto: EmailChangedDto) {
    return this.mailerService.requestEmailChangeCustomer(dto);
  }
}
