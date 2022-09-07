import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { random } from 'lodash';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceHistoryItem } from './invoice-history-item.entity';
import { InvoicePosition } from './invoice-position.entity';
import { Organization } from './organization.entity';
import { Payment } from './payment.entity';
import { Student } from './student.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  invoice_number?: number;

  /**
   * The date on which the invoice was finalized,
   * i.e. after which it isn't editable anymore and turns from a pending invoice into a finished invoice
   */
  @Column({
    nullable: true,
    type: 'timestamp',
  })
  finalized_at?: string;

  /**
   * Start date of the timespan of which this invoice should include all lessons the student has taken
   */
  @Column({ nullable: true, type: 'date' })
  accounting_period_start?: Date;

  /**
   * End date of the timespan of which this invoice should include all lessons the student has taken
   */
  @Column({ nullable: true, type: 'date' })
  accounting_period_end?: Date;

  @ManyToOne(() => Student, (student) => student.invoices, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  student?: Student;

  @OneToMany(() => InvoicePosition, (ip) => ip.invoice, {
    nullable: false,
  })
  positions: InvoicePosition[];

  @ManyToOne(() => Organization, (org) => org.invoices, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  payments?: Payment[];

  @OneToMany(() => InvoiceHistoryItem, (h) => h.invoice, { nullable: true })
  invoiceHistory?: InvoiceHistoryItem[];

  constructor(id: string) {
    this.id = id;
  }

  setRandomAccountingPeriod?() {
    const min = dayjs().subtract(60, 'd').toDate().getTime();
    const max = dayjs().add(10, 'd').toDate().getTime();
    const start = random(min, max);
    const duration = random(5, 60);
    this.accounting_period_start = dayjs(start).startOf('day').toDate();
    this.accounting_period_end = dayjs(start)
      .add(duration, 'day')
      .startOf('day')
      .toDate();
  }
}

export class InvoiceSummary {
  @ApiProperty({ type: 'number' })
  total: number;
  @ApiProperty({ type: 'number' })
  invoice_number?: number;
  @ApiProperty()
  finalized_at?: string;
  @ApiProperty()
  id?: string;
  @ApiProperty()
  payment_due_date?: Date;
  @ApiProperty()
  paid_already?: number;
  @ApiProperty({ type: Student })
  student: Student;
}
