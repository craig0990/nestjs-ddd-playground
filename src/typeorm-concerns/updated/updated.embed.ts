import { Column, UpdateDateColumn } from 'typeorm';

export class UpdatedEmbed {
  @Column({ type: 'varchar', nullable: true })
  by?: string;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  at?: Date;
}
