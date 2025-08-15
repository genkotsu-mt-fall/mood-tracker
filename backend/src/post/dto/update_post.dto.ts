// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create_post.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreatePostDto)
export class UpdatePostDto extends PartialType(CreatePostDto) {}
