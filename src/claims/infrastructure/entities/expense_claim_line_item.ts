import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExpenseClaim } from './expense_claim.entity';

@Entity('expense_claim_line_item')
export class ExpenseClaimLineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  item_name: string;

  @Column({ type: 'decimal' })
  amount: number;

  @ManyToOne(() => ExpenseClaim, (claim) => claim.lineItems)
  expenseClaim: ExpenseClaim;
}
