// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }
  async create(task: Task): Promise<Task> {
    try {
      const createdTask = await this.tasksRepository.save(task);
      return createdTask;
    } catch (error) {
      // Handle the error, e.g., log it or throw a custom exception
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }
  update(id: number, task: Task): Promise<Task> {
    return this.tasksRepository.save({ ...task, id: id });
  }
  
  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}