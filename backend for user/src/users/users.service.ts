import { Injectable ,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/typeorm/task';
import { Repository } from 'typeorm';
import {updateuserparams, userparams} from 'src/utils/type'
import { updateuserdto } from 'src/dto/updateuser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Task)  private userRepository:Repository<Task>){}
  findusers(){
    return this.userRepository.find()
  }
  createusers(userdetails:userparams){
    const newuser= this.userRepository.create({...userdetails});
    return this.userRepository.save(newuser);
  }
  

  deleteuser(id:number){
    return this.userRepository.delete({ id });
    }

    async updateTaskContent(id: number, updateTaskDto: updateuserdto) {
      const task = await this.userRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      task.content = updateTaskDto.content;
      return this.userRepository.save(task);
    }
  }
  
