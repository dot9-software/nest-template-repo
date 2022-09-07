import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from './product.entity';
import { WorkEvent } from './work-event.entity';

/**
 * One row of an invoice, e g. a lesson that is billed to the student or a discount on an invoice
 */
@Entity()
export class InvoicePosition {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  title: string;

  /**
   * Total (flat) price of the position in CHF
   */
  @Column({ nullable: false, type: 'float' })
  price: number;

  /**
   * Work event that this position references, i. e. a lesson that a student has taken
   */
  @OneToOne(() => WorkEvent, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  event?: WorkEvent;

  /**
   * Product that this position is based on, in case it isn't a position related to a lesson
   */
  @ManyToOne(() => Product, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  product?: Product;

  @ManyToOne(() => Invoice, (i) => i.positions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  invoice?: Invoice;
}
