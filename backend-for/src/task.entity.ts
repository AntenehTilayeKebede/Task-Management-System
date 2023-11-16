import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['id'])
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
columnId:number;

  @Column()
  content: string;
}