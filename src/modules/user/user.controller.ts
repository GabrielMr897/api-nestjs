import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post(':followerId/follow/:followingId')
  async followUser(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.userService.followUser(Number(followerId), Number(followingId));
  }

  @Delete(':followerId/unfollow/:followingId')
  async unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followingId') followingId: number,
  ) {
    return this.userService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return this.userService.getFollowers(Number(userId));
  }

  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    return this.userService.getFollowing(Number(userId));
  }
}
