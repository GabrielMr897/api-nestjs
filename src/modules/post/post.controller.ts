import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':id')
  create(@Body() createPostDto: CreatePostDto, @Param('id') id: string) {
    return this.postService.create(createPostDto, Number(id));
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/getPostsF')
  async getPostsFromFollowing(@Request() req) {
    console.log(req);
    const userId = req.body.id;
    return this.postService.getPostsFromFollowing(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(Number(id), updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(Number(id));
  }
}
