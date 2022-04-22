import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Order, OrderSchema } from './schemas/order.schema';
import { MicroserviceRepository } from './repositories/MicroserviceRepository';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`,
    ),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: process.env.EXCHANGE_NAME,
          type: 'topic',
        },
      ],
      uri: `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
      connectionInitOptions: { wait: false },
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MicroserviceRepository],
})
export class AppModule {}
