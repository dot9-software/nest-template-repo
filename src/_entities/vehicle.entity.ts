import { ApiProperty } from '@nestjs/swagger';
import { VehicleInfo } from '../types/VehicleInfo';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkEvent } from './work-event.entity';
import { User } from './user.entity';
import { LicenseCategory } from './common/license-category';
import { Organization } from './organization.entity';

/**
 * Any vehicle that the organization owns that can be booked for driving lessons
 */
@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  /**
   * The license category that the vehicle can be booked for. E.g. trucks can only be booked for truck driving lessons
   */
  @ApiProperty({ enum: LicenseCategory, enumName: 'LicenseCategory' })
  @Column({
    type: 'enum',
    enum: LicenseCategory,
    default: LicenseCategory.CAR_B,
    nullable: false,
  })
  licenseCategory: LicenseCategory;

  /**
   * A second license category that the vehicle can be booked for.
   * E.g. a car with a trailer coupling can be booked for normal car driving lessons and trailer driving lessons
   */
  @ApiProperty({
    enum: LicenseCategory,
    enumName: 'LicenseCategory',
    description:
      'Another license category the vehicle can be used for, e.g. B and BE for most cars.',
  })
  @Column({
    type: 'enum',
    enum: LicenseCategory,
    nullable: true,
  })
  secondaryLicenseCategory?: LicenseCategory;

  @Column({ nullable: false })
  license_plate: string;

  @Column({ nullable: true })
  title?: string;

  /**
   * Some more optional information about the vehicle such as technical and legal details
   */
  @Column({ type: 'json', nullable: true })
  additional_info?: VehicleInfo;

  @ManyToOne(() => Organization, (organization) => organization.vehicles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  // TODO: correct the cascade here to proper onDelete: "cascade" - the cascade here only allows for
  // users to be inserted via this relation, see https://stackoverflow.com/a/55101273
  @ManyToMany(() => User, (instructor) => instructor.assigned_vehicles, {
    nullable: true,
  })
  @JoinTable()
  assigned_instructors?: User[];

  @OneToMany(() => WorkEvent, (event) => event.vehicle, { nullable: true })
  events?: WorkEvent[];

  constructor(id: string) {
    this.id = id;
  }
}
