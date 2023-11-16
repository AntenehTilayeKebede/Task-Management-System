// src/columns/columns.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { KanbanColumn } from './kanabancolumn.entity';
@Module({
  imports: [TypeOrmModule.forFeature([KanbanColumn])],
  providers: [ColumnsService],
  controllers: [ColumnsController],
})
export class ColumnsModule {}