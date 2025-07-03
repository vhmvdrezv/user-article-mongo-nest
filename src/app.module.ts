import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/user-article-db'),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
