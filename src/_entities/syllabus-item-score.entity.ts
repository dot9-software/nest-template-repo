import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { WorkEvent } from './work-event.entity';
import { Lesson } from './lesson.entity';
import { SyllabusProgressCard } from './syllabus-progress-card.entity';

/**
 * A single score within a syllabus progress card
 * E.g. a score of 5 (very good) for the syllabus "Driver's license B" on the lesson "parallel parking" for the driving lesson on January 1st
 */
@Entity()
export class SyllabusItemScore {
  @PrimaryColumn()
  progressCardId: string;

  @ManyToOne(() => SyllabusProgressCard, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  progressCard?: SyllabusProgressCard;

  /**
   * The calendar event for which the student is scored, i.e. the driving lesson on which they are scored
   */
  @PrimaryColumn()
  calendarEventId: string;

  @ManyToOne(() => WorkEvent, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  calendarEvent?: WorkEvent;

  /**
   * The specific lesson of the syllabus that they have been scored in
   */
  @PrimaryColumn()
  lessonId: string;

  @ManyToOne(() => Lesson, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  lesson?: Lesson;

  @Column({ nullable: false, type: 'char', default: '-' })
  score: string;
}
