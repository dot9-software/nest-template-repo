import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Length, Max, Min } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { range } from 'lodash';
import { Organization } from './organization.entity';
import { Student } from './student.entity';
import { TimesheetMetadata } from './timesheet-meta.entity';
import { Vehicle } from './vehicle.entity';
import { UserAccessRight } from './user-access-right.entity';
import { ICalSubscription } from './ical-subscription.entity';
import { TailwindColor } from './common/colors';

export const workTimePercentages = range(0, 101, 5);

export class WorkTimePercentageChange {
  @ApiProperty({
    description:
      'The date of the change, formatted as YYYY-MM-DD, currently with day always at 1',
    type: 'string',
  })
  @Length(10)
  date: yearMonthDay; // 'YYYY-MM-DD'

  @ApiProperty({ type: 'enum', enum: workTimePercentages })
  @IsInt()
  @Max(100)
  @Min(0)
  percentage: number;
}

// TODO: does this really belong here?
export type formattedMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type dayRange =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;
export type yearMonthDay = `${number}-${formattedMonth}-${dayRange}` | '';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: false, default: false })
  isAdmin: boolean;

  @Column({ nullable: false, default: false })
  isBackoffice: boolean;

  @Column({ nullable: false, default: false })
  isInstructor: boolean;

  @Column({ default: false })
  @Index()
  archived: boolean;

  @OneToMany(() => Student, (student) => student.instructor)
  students?: Student[];

  @OneToMany(() => TimesheetMetadata, (timesheet) => timesheet.user, {
    nullable: true,
  })
  timesheets?: TimesheetMetadata[];

  @OneToMany(
    () => ICalSubscription,
    (iCalSubscription) => iCalSubscription.user,
    {
      nullable: true,
    },
  )
  icalSubscriptions?: ICalSubscription[];

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.assigned_instructors, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  assigned_vehicles?: Vehicle[];

  @ManyToOne(() => Organization, (org) => org.users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization?: Organization;

  /**
   * An instructor's worktime percentage is the percentage they are supposed to work of the required hours for full-time work.
   * E.g. someone who only works 3 out of 5 days per week would have worktime percentage 60%
   * The worktime_percentage_changes are all changes that have been made to the user's worktime since the user was created.
   * This has to be stored so that the required hours on time-tracking can be correctly computed even if the user worked part-time for some time, and then full-time later
   */
  @Column({ nullable: false, default: [], type: 'json' })
  @ApiProperty({
    type: [WorkTimePercentageChange],
  })
  worktime_percentage_changes: WorkTimePercentageChange[];

  @OneToMany(() => UserAccessRight, (a) => a.right_holder, { cascade: true })
  access_rights?: UserAccessRight[];

  @ApiProperty({ enum: TailwindColor, enumName: 'Color' })
  @Column({
    type: 'enum',
    enum: TailwindColor,
    nullable: false,
    default: TailwindColor.blue,
  })
  calendar_color: TailwindColor;

  constructor(id: string) {
    this.id = id;
  }
}
