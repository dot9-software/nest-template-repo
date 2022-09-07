import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';
import { Organization } from './organization.entity';
import { Student } from './student.entity';
/*
 * Exam that students assigned to, each exam can have up to 4 exam attempts
 */
@Entity()
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Student, (s) => s.exams, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  student: Student;

  @OneToMany(() => ExamAttempt, (ea) => ea.exam, { nullable: true })
  examAttempts?: ExamAttempt[];

  @ManyToOne(() => Organization, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  constructor(id: string) {
    this.id = id;
  }
}
