import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LicenseCategory } from './common/license-category';
import { Organization } from './organization.entity';

/**
 * A product type for billing and booking calendar events
 * Example: "Führerschein B - Doppelstunde" or "Büroarbeit"
 */
@Entity()
export class BillingType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  /**
   * If a license category is provided, work events with this billing type are assumed to be actual driving lessons.
   * This means the work-events must have a vehicle and student, otherwise events cannot have vehicles and students are optional
   */
  @ApiProperty({ enum: LicenseCategory, enumName: 'LicenseCategory' })
  @Column({
    type: 'enum',
    enum: LicenseCategory,
    nullable: false,
    default: LicenseCategory.LICENSE_CATEGORY_UNDEFINED,
  })
  licenseCategory: LicenseCategory;

  @Column({ nullable: false, default: 0 })
  duration_minutes: number;

  /**
   * Time that is implicitly added to each event with this billing type for things like
   * administrative work or filling up gas
   */
  @Column({ nullable: false, default: 0, type: 'float' })
  shadow_time: number;

  /**
   * flat price, in CHF
   */
  @Column({ nullable: true, type: 'float' })
  price?: number;

  /**
   * Whether or not events with this billing type are required to have a description,
   * i.e. whether the user has to add some more explanation what they were doing
   */
  @Column({ default: false, nullable: false })
  requiresDescription: boolean;

  @ManyToOne(() => Organization, (org) => org.billingTypes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  /**
   * Whether or not events of this billing type count as working time for the time-tracking.
   */
  @Column({ nullable: false, default: true })
  trackable: boolean;

  constructor(id: string) {
    this.id = id;
  }
}
