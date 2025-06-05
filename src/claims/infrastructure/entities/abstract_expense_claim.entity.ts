import { AuditConcern } from 'src/shared/infrastructure/concerns/audit/audit.concern';
import { AuditEmbed } from 'src/shared/infrastructure/concerns/audit/audit.embed';
import { Column } from 'typeorm';

/**
 * Common fields that expense claim reviews should have regardless of whether
 * they are escalated or not
 */
export abstract class AbstractExpenseClaim implements AuditConcern {
  @Column({ type: 'uniqueidentifier' })
  employee_id: string;

  @Column({ type: 'varchar' })
  employee_name: string;

  @Column({ type: 'bigint' })
  claim_no: number;

  @Column({ type: 'datetime' })
  submission_date: Date;

  @Column(() => AuditEmbed, { prefix: false })
  audit: AuditEmbed;
}
