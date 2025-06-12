import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Note } from './note.entity';

@Entity('thread')
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => Note, (note) => note.thread)
  notes: Note[];
}
