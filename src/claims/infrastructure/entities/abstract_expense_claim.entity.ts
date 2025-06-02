import {
  CreatedConcern,
  CreatedEmbed,
  UpdatedConcern,
  UpdatedEmbed,
} from '../../../typeorm-concerns';
import { Column } from 'typeorm';

/**
 * Common fields that expense claim reviews should have regardless of whether
 * they are escalated or not
 */
export abstract class AbstractExpenseClaim
  implements CreatedConcern, UpdatedConcern
{
  @Column({ type: 'uniqueidentifier' })
  employee_id: string;

  @Column({ type: 'varchar' })
  employee_name: string;

  @Column({ type: 'bigint' })
  claim_no: number;

  @Column({ type: 'datetime' })
  submission_date: Date;

  @Column(() => CreatedEmbed, { prefix: 'created' })
  created: CreatedEmbed;

  @Column(() => UpdatedEmbed, { prefix: 'updated' })
  updated: UpdatedEmbed;
}
