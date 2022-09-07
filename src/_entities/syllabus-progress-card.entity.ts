import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './student.entity';
import { SyllabusItemScore } from './syllabus-item-score.entity';
import { Syllabus } from './syllabus.entity';

// type score = 1 | 2 | 3 | 4 | 5;

/*
 * A SyllabusProgressCard is an instance of a student taking a specific syllabus.
 * Each time they have an appointment, they get scored on the lessons.
 * i.e. {
 *   "Lenkradbedienung": [1,3,5]
 *   "Schalten": [,,5]
 * }
 *  means that they scored 1 in the first appointment, 3 in the second, 5 in the third appointment for "Lenkradbedienung."
 *  "Schalten" wasn't scored until the third appointment, where they got a 5.
 *
 * See http://go/tr-syllabus-screenshot.
 */
@Entity()
export class SyllabusProgressCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Syllabus, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  syllabus?: Syllabus;

  @ManyToOne(() => Student, (s) => s.syllabusProgressCards, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  student?: Student;

  @OneToMany(() => SyllabusItemScore, (score) => score.progressCard, {
    nullable: true,
  })
  syllabusItemScores?: SyllabusItemScore[];
}
