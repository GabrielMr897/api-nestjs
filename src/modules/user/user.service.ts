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
        createdAt: new Date(), // Atribuir o valor atual da data/hora do servidor
        password: hashedPassword, // salvar a senha encriptada
      },
    });

    if (!emailUserExists) {
      throw new Error('email already exists');
    }

    return user;
  }

  findAll() {
    return `This action returns all user`;
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
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
