import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address, FullAddress } from './address.entity';
import { User } from './user.entity';
import { Invoice } from './invoice.entity';
import { Organization } from './organization.entity';
import { Payment } from './payment.entity';
import { SyllabusProgressCard } from './syllabus-progress-card.entity';
import { StudentGroup } from './student-group.entity';
import { DropOutItem } from './drop-out-item.entity';
import { Exam } from './exam.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ nullable: false })
  firstName: string;

  @Index()
  @Column({ nullable: false })
  lastName: string;

  /**
   * Current balance of the student, defined as balance = (sum of all payments) - (sum of all invoices, including pending invoices)
   * This value is automatically calculated by some endpoints and added to the returned values, which is why this is not a db column, but just a class member
   */
  balance?: number;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: false })
  student_number: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  email?: string;

  /**
   * Email address that is used to send invoices to the student
   */
  @Column({ nullable: true })
  billingEmail?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  secondaryPhone?: string;

  @Column(() => Address)
  primaryAddress: Address;

  /**
   * Address that is used to address student invoices to
   */
  @Column(() => FullAddress)
  billingAddress: FullAddress;

  @Column({ default: false })
  @Index()
  archived: boolean;

  @ManyToOne(() => Organization, (org) => org.students, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization?: Organization;

  // FIXME: should we really delete all students that belong to one user as soon as that user leaves the org/gets deleted?
  @ManyToOne(() => User, (i) => i.students, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  instructor?: User;

  @OneToMany(() => SyllabusProgressCard, (s) => s.student, { nullable: true })
  syllabusProgressCards?: SyllabusProgressCard[];

  @OneToMany(() => Invoice, (i) => i.student, { nullable: true })
  invoices?: Invoice[];

  @OneToMany(() => Payment, (p: Payment) => p.student, { nullable: true })
  payments?: Payment[];

  @OneToOne(() => DropOutItem, (p: DropOutItem) => p.student, {
    nullable: true,
  })
  dropoutItem?: DropOutItem;

  @CreateDateColumn()
  createdDate?: Date;

  @Column({ nullable: false, default: [], type: 'json' })
  @ApiProperty({
    description:
      'Filenames of the attachments uploaded for this student, e.g. lernfahrausweis.pdf. Suffix of the GCP Cloud Storage object path that is constructed for each file.',
  })
  attachmentFilenames: string[];

  @ManyToMany(() => StudentGroup, (g) => g.students, { nullable: true })
  @JoinTable()
  groups: StudentGroup[];

  @OneToMany(() => Exam, (e: Exam) => e.student, { nullable: true })
  exams?: Exam[];

  constructor(id: string) {
    this.id = id;
  }
}
