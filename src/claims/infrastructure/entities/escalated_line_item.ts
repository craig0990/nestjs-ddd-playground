import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { AbstractExpenseClaim } from './abstract_expense_claim.entity';
import { ExpenseClaimLineItem } from './expense_claim_line_item';

@Entity('escalated_line_item')
export class EscalatedLineItem extends AbstractExpenseClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => ExpenseClaimLineItem)
  @JoinColumn()
  lineItem: ExpenseClaimLineItem;
}
