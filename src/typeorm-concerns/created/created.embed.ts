import { Column, CreateDateColumn } from 'typeorm';

export class CreatedEmbed {
  @Column({ type: 'varchar' })
  by: string;

  @CreateDateColumn({ type: 'datetime' })
  at: Date;
}
