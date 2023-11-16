// src/columns/columns.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { KanbanColumn } from './kanabancolumn.entity';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  findAll(): Promise<KanbanColumn[]> {
    return this.columnsService.findAll();
  }

  @Post()
  create(@Body() column: KanbanColumn): Promise<KanbanColumn> {
    return this.columnsService.create(column);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() column:KanbanColumn): Promise<KanbanColumn> {
    return this.columnsService.update(Number(id), column);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.columnsService.remove(Number(id));
  }
}