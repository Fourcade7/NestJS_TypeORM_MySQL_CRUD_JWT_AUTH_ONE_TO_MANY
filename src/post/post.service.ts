import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {


  constructor(@InjectRepository(Post) private readonly postRepository:Repository<Post>){}

  async create(userId:number,createPostDto: CreatePostDto) {
    
    const post= this.postRepository.create({
      ...createPostDto,
      user:{id:userId}
    });
    await this.postRepository.save(post);
    return post;
  }

  async findAll() {
    return this.postRepository.find();
  }

  async findOne(id: number) {
    const checkPost= await this.postRepository.findOne({
      where:{id},
      relations:["user"]
    })
    if(!checkPost) throw new NotFoundException("Post Not Found");

    return checkPost;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const checkPost= await this.postRepository.findOneBy({id})
    if(!checkPost) throw new NotFoundException("Post Not Found");
    const updatedPost= await this.postRepository.preload({
      id,
      ...updatePostDto
    })
    if(!updatedPost) throw new NotFoundException("Post Not Updated");
    await this.postRepository.save(updatedPost);
    return updatedPost;
  }

  async remove(id: number) {
    const checkPost= await this.postRepository.findOneBy({id})
    if(!checkPost) throw new NotFoundException("Post Not Found");
    await this.postRepository.remove(checkPost);

    return {message:"Post deleted"};
  }
}
