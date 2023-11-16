import { Controller, Get, Post, Delete, Body, Put, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { createuserdto } from 'src/dto/createuser.dto';
import { updateuserdto } from 'src/dto/updateuser.dto';
@Controller('task')
export class UsersController {
  constructor(private readonly userservice: UsersService) {}

  @Get()
  getusers() {
    return this.userservice.findusers();
  }

  @Post()
  createusers(@Body() createuserdto: createuserdto) {
    return this.userservice.createusers(createuserdto);
  }
  
  
  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.userservice.deleteuser(id);
    return { message: 'User deleted successfully' };
  }
  @Put(':id')
  async updateTaskContent(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: updateuserdto) {
    return this.userservice.updateTaskContent(id, updateTaskDto);
  }

}