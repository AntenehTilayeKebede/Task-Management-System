// src/tasks/tasks.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() task: Task): Promise<Task> {
    // Convert columnId to an integer if it's a string
    if (typeof task.columnId === 'string') {
      task.columnId = parseInt(task.columnId);
    }
  
    // Validate columnId
    if (!Number.isInteger(task.columnId)) {
      throw new Error('columnId must be an integer');
    }
  
    return this.tasksService.create(task);
  }
  
  
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() task: Task): Promise<Task> {
    return this.tasksService.update(id, task);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.remove(id);
  }
}