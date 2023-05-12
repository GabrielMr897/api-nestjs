import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private userService: UserService;

  async create(data: CreatePostDto, authorId: number) {
    return this.prisma.post.create({
      data: {
        ...data,
        authorId: authorId,
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  async getPostsFromFollowing(request: any) {
    const user = request.user as User;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // Busca a lista de usuários que o usuário segue
    const followers = await this.prisma.follower.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });
    const followingIds = followers.map((f) => f.followingId);

    console.log(followingIds);

    // Busca todos os posts dos usuários que o usuário segue
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: {
          in: followingIds,
        },
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
      },
    });

    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
