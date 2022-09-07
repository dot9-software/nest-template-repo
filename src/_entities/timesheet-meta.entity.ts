import {
  CarryOverManualEdit,
  monthIndex,
} from '../timesheets/dto/create-timesheet.dto';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Additional information that any timesheet carries apart from just the hours worked and vacation taken
 */
@Entity()
@Unique('ONE_TIMESHEET_PER_USERYEAR', ['year', 'user'])
export class TimesheetMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  year: string;

  @ManyToOne(() => User, (i) => i.timesheets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user?: User;

  /**
   * Manual edits to the hours tracked for a specific months, e.g. to model that overtime has been paid off and therefore shouldn't appear as overtime on the timesheet anymore
   */
  @Column({ type: 'json', default: [] })
  carryOverManualEdits: CarryOverManualEdit[];

  /**
   * Manual edits similar to the above, except for vacation
   */
  @Column({ type: 'json', default: [] })
  vacationManualEdits: CarryOverManualEdit[];

  /**
   * The months of this sheet's year that cannot be edited anymore, i.e. no calendar events can be created or edited in these months and only admins can add manual carry over edits
   */
  @Column({ type: 'json', default: [] })
  @ApiProperty({
    type: 'array',
    items: { type: 'number', minimum: 0, maximum: 11 },
  })
  lockedMonths: monthIndex[];

  constructor(year: string) {
    this.year = year;
  }
}
