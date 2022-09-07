import * as dayjs from 'dayjs';
import { random } from 'lodash';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceType } from './invoice-type.entity';
import { Invoice } from './invoice.entity';

/**
 * This entity saves the state of an invoice once sent or updated.
 *
 * e.g. on invoice creation the first history item would include the normal "invoice"
 * type, recording an invoice of type "invoice" was sent. If a student then doesn't
 * pay up, a second history item would be added with invoice type "warning 1".
 */
@Entity({ orderBy: { sent_date: 'DESC' } })
export class InvoiceHistoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, (i) => i.invoiceHistory, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  invoice: Invoice;

  /**
   * Time at which the related invoice was sent to the student by mail
   */
  @Column({ type: 'timestamp', nullable: true })
  sent_date?: string;

  /**
   * New (changed) due date of the invoice. Usually corresponds with the invoice having a new invoice type
   */
  @Column({ type: 'date', nullable: true })
  due_date?: Date;

  // if there is an InvoiceHistoryItem, the corresponding invoiceType cannot be deleted
  @ManyToOne(() => InvoiceType, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
    nullable: true,
  })
  invoice_type?: InvoiceType;

  /**
   * Date that the invoice history item was created on
   */
  @CreateDateColumn({ nullable: false })
  created_date: Date;

  setRandomDueDate?() {
    const min = dayjs().subtract(14, 'd').toDate().getTime();
    const max = dayjs().add(14, 'd').toDate().getTime();
    const dueDate = random(min, max);
    this.due_date = dayjs(dueDate).startOf('day').toDate();
  }

  constructor(id: string) {
    this.id = id;
  }
}
