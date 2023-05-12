import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';
export const jwtSecret = 'zjP9h6ZI5LoSKCRj';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '5m' }, // e.g. 30s, 7d, 24h
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {}
