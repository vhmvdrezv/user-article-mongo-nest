import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './articles/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath:  ['.env']
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    ArticlesModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, 
        limit: 5,
      },
      {
        name: 'medium',
        ttl: 10000, 
        limit: 30,
      },
      {
        name: 'long',
        ttl: 60000, 
        limit: 90,
      },
    ])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
}
)
export class AppModule {}
