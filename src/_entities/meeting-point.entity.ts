import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';
import { Organization } from './organization.entity';

/**
 * This entity describes a meeting point, a location where
 *  student and instructor meet at the start of an event.
 *
 * Every calendar event can have a meeting point that is
 * sent with the event invitation email.
 * We just specify a title here as a meeting point would
 * probably be something like "In front of the driving school".
 */
@Entity()
export class MeetingPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Organization, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @Column(() => Address)
  address: Address;

  constructor(id: string) {
    this.id = id;
  }
}
