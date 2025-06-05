import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class AuditEmbed {
  @Column({ type: 'varchar' })
  createdBy: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  updatedBy?: string;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt?: Date;
}
