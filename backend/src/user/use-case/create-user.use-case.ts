// import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create_user.dto';
import { UserEntity } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    // const existing = await this.userRepo.findByEmail(dto.email);
    // if (existing) {
    //   throw new BadRequestException('Email already exists');
    // }
    return await this.userRepo.create(dto);
  }
}
