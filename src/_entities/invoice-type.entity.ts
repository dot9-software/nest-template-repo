import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';

/**
 * Types of invoices include regular invoices, warnings (= Mahnungen) and however much more
 * you want to include. These types have a title, description and "due date in days" -
 * how many days after the creation of an invoice of this type is it due.
 *
 * Invoice types follow a progression - e.g. after "warning 1" comes "warning 2", which is
 * implemented in a doubly linked list fashion. The `active` flag is there if the organization
 * admin decides to replace one invoice type with another/delete one. Querying should default
 * to only showing active invoice types.
 */
@Entity()
export class InvoiceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * flag whether the invoice type is in use or legacy
   */
  @Column({ default: false })
  active: boolean;

  @Column()
  title: string;

  /**
   * description text that will appear on pdf prints
   */
  @Column()
  description: string;

  /**
   * how many days after the creation of a due date of this type is the invoice due
   *
   * invoice creation date + due_date_days = invoice due date
   */
  @Column()
  due_date_days: number;

  @ManyToOne(() => Organization, (org) => org.invoiceTypes, {
    onDelete: 'CASCADE', // delete invoice types for org if org is deleted
    nullable: false,
  })
  organization: Organization;

  /**
   * invoice types come one after the other (after "mahnung 1" comes "mahnung 2"),
   * which is represented in this order property
   */
  @Column()
  order: number;

  constructor(id: string) {
    this.id = id;
  }
}
