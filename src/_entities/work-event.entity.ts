import { ChildEntity, Column, Index, ManyToOne, OneToMany } from 'typeorm';
import { BillingType } from './billing-type.entity';
import { Student } from './student.entity';
import { SyllabusItemScore } from './syllabus-item-score.entity';
import { Vehicle } from './vehicle.entity';
import { CalendarEntry } from './calendar-entry.entity';
import { MeetingPoint } from './meeting-point.entity';
import { Address } from './address.entity';
import * as dayjs from 'dayjs';
import { random } from 'lodash';

@ChildEntity()
export class WorkEvent extends CalendarEntry {
  @ManyToOne(() => BillingType, { nullable: true })
  billingType?: BillingType;

  // // FIELDS FOR STUDENT APPOINTMENTS
  // // The following fields are filled for student appointments,
  // // but not for entries like office work.

  /**
   * Place for the student and instructor to meet at the start of the driving lesson
   */
  @ManyToOne(() => MeetingPoint, { nullable: true })
  meetingPoint?: MeetingPoint;

  /**
   * Optional alternative to meeting point: the instructor can also choose an arbitrary address as the meeting point for the driving lesson
   */
  @Column(() => Address)
  meetingAddress: Address;

  @ManyToOne(() => Student, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Index()
  student?: Student;

  @OneToMany(() => SyllabusItemScore, (s) => s.calendarEvent, {
    nullable: true,
  })
  syllabusItemScore?: SyllabusItemScore[];

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.events, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  vehicle?: Vehicle;

  /**
   * A second vehicle that has been booked for the events, e.g. trailer driving lessons always book a car and a trailer
   */
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.events, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  secondaryVehicle?: Vehicle;

  setRandomDate?() {
    const min = dayjs().subtract(7, 'd').toDate().getTime();
    const max = dayjs().add(7, 'd').toDate().getTime();
    const start = random(min, max);
    const duration = random(15, 150);
    const startDayjs = dayjs(start).hour(random(5, 20));
    this.start_time = startDayjs.toDate();
    this.end_time = startDayjs.add(duration, 'm').toDate();
  }
}
