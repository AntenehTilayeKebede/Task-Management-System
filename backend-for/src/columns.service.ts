// src/columns/columns.service.ts
import {Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KanbanColumn } from './kanabancolumn.entity';
@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(KanbanColumn)
    private columnsRepository: Repository<KanbanColumn>,
  ) {}

  findAll(): Promise<KanbanColumn[]> { 
    return this.columnsRepository.find();
  }

  create(column: KanbanColumn): Promise<KanbanColumn> {
    return this.columnsRepository.save(column);
  }

  update(id: number, column: KanbanColumn): Promise<KanbanColumn> {
    return this.columnsRepository.save({ ...column, id: Number(id) });
  }

  async remove(id: number): Promise<void> {
    await this.columnsRepository.delete(id);
  }
}