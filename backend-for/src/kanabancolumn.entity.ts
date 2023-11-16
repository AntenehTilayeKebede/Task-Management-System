// src/columns/kanbanColumn.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class KanbanColumn {
  @PrimaryGeneratedColumn()
  id:Number;

  @Column()
  title: string;
  

  
}