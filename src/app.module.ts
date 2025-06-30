import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/user-article-db'),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ArticlesModule,
  ],
})
export class AppModule {}
