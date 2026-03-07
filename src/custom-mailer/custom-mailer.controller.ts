import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CustomMailerService } from './custom-mailer.service';
import { MAILER_PATTERNS } from './patterns/mailer_patterns';
import { ForgotPasswordEmailData, VerifyEmailData } from 'src/types/types';

@Controller()
export class CustomMailerController {
  constructor(private readonly mailerService: CustomMailerService) {}

  @EventPattern(MAILER_PATTERNS.FORGOT_PASSWORD)
  async forgotPassword(@Payload() data: ForgotPasswordEmailData) {
    return this.mailerService.forgotPassword(data.email, data.resetUrl);
  }

  @EventPattern(MAILER_PATTERNS.VERIFY_EMAIL)
  async verifyEmail(@Payload() data: VerifyEmailData) {
    return this.mailerService.verifyEmail(data.email, data.verifyUrl);
  }
}
