import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['id'])
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1}) 
  columnId: number;

  @Column()
  content: string;
}