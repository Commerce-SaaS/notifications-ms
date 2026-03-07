import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Notifications MS');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [envs.rabbitmqUrl],
      queue: envs.rabbitmqEventsQueue,
      queueOptions: {
        durable: true,
      }
    }
  });
  await app.listen();
  logger.log(`Notifications Microservice is running on port ${envs.port}`);
}
bootstrap();
