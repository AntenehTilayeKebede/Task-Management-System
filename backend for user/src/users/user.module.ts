import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/typeorm/task';

@Module({
  imports:[TypeOrmModule.forFeature([Task] )],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UserModule {}
