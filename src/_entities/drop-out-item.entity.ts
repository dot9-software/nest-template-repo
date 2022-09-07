import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DropOutReason } from './drop-out-reason.entity';
import { Student } from './student.entity';

@Entity()
export class DropOutItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Student, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  student: Student;

  @ManyToOne(() => DropOutReason, { nullable: false, onDelete: 'RESTRICT' })
  reason: DropOutReason;

  @Column({ type: 'timestamp' })
  date: Date;
}
