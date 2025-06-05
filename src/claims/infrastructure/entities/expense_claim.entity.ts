import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AbstractExpenseClaim } from './abstract_expense_claim.entity';
import { ExpenseClaimLineItem } from './expense_claim_line_item';

@Entity('expense_claim')
export class ExpenseClaim extends AbstractExpenseClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ExpenseClaimLineItem, (claimItem) => claimItem.expenseClaim)
  lineItems: ExpenseClaimLineItem[];
}
