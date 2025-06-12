import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Thread } from './thread.entity';

@Entity('note')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => Thread, (thread) => thread.notes)
  thread: Thread;
}
