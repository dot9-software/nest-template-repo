import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SyllabusItemScore } from './syllabus-item-score.entity';
import { Syllabus } from './syllabus.entity';

/*
 * A Lesson within a Syllabus, e.g. 'Schalten'.
 */
@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Syllabus, (s: Syllabus) => s.lessons, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  syllabus?: Syllabus;

  @OneToMany(() => SyllabusItemScore, (s) => s.lesson, { nullable: true })
  syllabusItemScores?: SyllabusItemScore[];

  constructor(id: string) {
    this.id = id;
  }
}
