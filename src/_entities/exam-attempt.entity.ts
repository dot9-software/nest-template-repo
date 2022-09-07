import { Max, Min } from 'class-validator';
import * as dayjs from 'dayjs';
import { random } from 'lodash';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from './exam.entity';
import { Organization } from './organization.entity';
/*
 * Each exam can have up to 4 exam attempts
 */
@Entity()
export class ExamAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Max(4)
  @Min(1)
  @Column({ nullable: false })
  attempt_number: number;

  @Column({ type: 'date', nullable: false })
  exam_date: Date;

  @Column({ nullable: false })
  examiner: string;

  @Column({ nullable: false })
  passed: boolean;

  @Column({ nullable: true })
  comment?: string;

  @ManyToOne(() => Exam, (e) => e.examAttempts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  exam: Exam;

  @ManyToOne(() => Organization, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  constructor(id: string) {
    this.id = id;
  }

  setRandomDate?() {
    const min = dayjs().subtract(7, 'd').toDate().getTime();
    const max = dayjs().add(7, 'd').toDate().getTime();
    const start = random(min, max);
    const startDayjs = dayjs(start).hour(random(5, 20));
    this.exam_date = startDayjs.toDate();
  }
}
