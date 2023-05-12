import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const emailUserExists = this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = this.prisma.user.create({
      data: {
        ...data, // Usar todos os dados do DTO
        password: hashedPassword, // salvar a senha encriptada
      },
    });

    if (!emailUserExists) {
      throw new Error('email already exists');
    }

    return user;
  }

  findAll() {
    const users = this.prisma.user.findMany();

    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: {
          include: {
            likes: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }
  async update(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.update({
      data,
      where: {
        id: id,
      },
    });

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async followUser(followerId: number, followingId: number) {
    const follower = await this.prisma.user.findUnique({
      where: { id: followerId },
    });
    const following = await this.prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new Error('Usuário não encontrado');
    }

    const existingFollower = await this.prisma.follower.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existingFollower) {
      throw new Error('Usuário já segue esse perfil');
    }

    const newFollower = await this.prisma.follower.create({
      data: {
        follower: {
          connect: { id: followerId },
        },
        following: {
          connect: { id: followingId },
        },
      },
    });

    return newFollower;
  }

  async unfollowUser(followerId: number, followingId: number) {
    const existingFollower = await this.prisma.follower.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (!existingFollower) {
      throw new Error('Usuário não segue esse perfil');
    }

    const deletedFollower = await this.prisma.follower.delete({
      where: { id: existingFollower.id },
    });

    return deletedFollower;
  }

  async getFollowers(userId: number) {
    const following = await this.prisma.follower.findMany({
      where: { followingId: userId },
      select: { followerId: true },
    });

    const followerIds = following.map((f) => f.followerId);
    return this.prisma.user.findMany({
      where: { id: { in: followerIds } },
    });
  }

  async getFollowing(userId: number) {
    const followers = await this.prisma.follower.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = followers.map((f) => f.followingId);
    return this.prisma.user.findMany({
      where: { id: { in: followingIds } },
    });
  }
}
