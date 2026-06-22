import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordEmailDto } from './dto/forgot-password';
import { envs } from 'src/config';
import { EmailChangedDto } from './dto/email-changed.dto';

@Injectable()
export class CustomMailerService {
  constructor(private readonly mailerService: MailerService) {}
  private async sendTemplateEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      console.error(`Error sending ${template} email:`, error);
      RpcExceptionHelper.internalServerError(`Error sending ${template} email`);
    }
  }

  async forgotPasswordSaaS(dto: ForgotPasswordEmailDto) {
    const { code, email: to, expirationMinutes } = dto;
    return this.sendTemplateEmail(
      to,
      'Reset your password',
      './forgot-password-saas',
      {
        otpCode: code,
        expirationMinutes,
        year: new Date().getFullYear(),
        logoUrl: envs.logoUrl,
        appName: envs.appName,
        appUrl: envs.appUrl,
      },
    );
  }

  async forgotPasswordCustomer(dto: ForgotPasswordEmailDto) {
    const { code, email: to, expirationMinutes, orgName, logoUrl } = dto;
    return this.sendTemplateEmail(
      to,
      'Reset your password',
      './forgot-password-customer',
      {
        otpCode: code,
        expirationMinutes,
        logoUrl,
        orgName,
        year: new Date().getFullYear(),
      },
    );
  }

  async verifyEmailSaaS(dto: VerifyEmailDto) {
    const { code, email: to, expirationMinutes } = dto;
    return this.sendTemplateEmail(
      to,
      'Verify your account',
      './verify-email-saas',
      {
        otpCode: code,
        expirationMinutes,
        year: new Date().getFullYear(),
        logoUrl: envs.logoUrl,
        appName: envs.appName,
        appUrl: envs.appUrl,
      },
    );
  }

  async verifyEmailCustomer(dto: VerifyEmailDto) {
    const { code, email: to, expirationMinutes, logoUrl, orgName } = dto;
    return this.sendTemplateEmail(
      to,
      'Verify your account',
      './verify-email-customer',
      {
        otpCode: code,
        expirationMinutes,
        year: new Date().getFullYear(),
        logoUrl,
        orgName,
      },
    );
  }

  async requestEmailChangeSaaS(dto: EmailChangedDto) {
    const { newEmail, email: to } = dto;
    return this.sendTemplateEmail(
      to,
      'Your email was changed',
      './email-changed-saas',
      {
        to,
        newEmail,
        year: new Date().getFullYear(),
        logoUrl: envs.logoUrl,
        appName: envs.appName,
        appUrl: envs.appUrl,
      },
    );
  }
  async requestEmailChangeCustomer(dto: EmailChangedDto) {
    const { newEmail, email: to, logoUrl, orgName } = dto;
    return this.sendTemplateEmail(
      to,
      'Your email was changed',
      './email-changed-customer',
      {
        to,
        newEmail,
        year: new Date().getFullYear(),
        logoUrl,
        orgName,
      },
    );
  }
}
