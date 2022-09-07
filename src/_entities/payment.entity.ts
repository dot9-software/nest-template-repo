import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { PaymentType } from './common/payment-type';
import { Student } from './student.entity';

/**
 * Payments that an organization receives from its students
 */
@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'float' })
  amount: number;

  @ManyToOne(() => Student, (s) => s.payments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  student?: Student;

  @Column({ nullable: true })
  description?: string;

  /**
   * Date that the payment was made
   */
  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @ApiProperty({ enum: PaymentType, enumName: 'PaymentType' })
  @Column({ nullable: false, type: 'enum', enum: PaymentType })
  paymentType: string;

  /**
   * Time when the db entry was created
   */
  @CreateDateColumn({ nullable: false })
  created_date: Date;

  invoice?: Invoice;

  constructor(id: string) {
    this.id = id;
  }
}
