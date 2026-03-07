import { Module } from '@nestjs/common';
import { CustomMailerModule } from './custom-mailer/custom-mailer.module';


@Module({
  imports: [CustomMailerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
