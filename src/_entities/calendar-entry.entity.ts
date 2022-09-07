import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class CalendarEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Optional description, filled if billingType.requiresDescription = true. */
  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: false })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_time: Date;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user?: User;

  @ManyToOne(() => Organization, (org) => org.calendarEvents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;
}
