import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LicenseCategory } from './common/license-category';
import { Organization } from './organization.entity';

/**
 * Products that can be added to an invoice apart from work-events
 * E.g. discounts or insurance fees
 */
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  /**
   * Total (flat) price of the product in CHF
   */
  @Column({ nullable: false, type: 'float' })
  price: number;

  @ManyToOne(() => Organization, (org) => org.syllabuses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  /**
   * If this property is provided, whenever a student books a driving lesson for the specified license category for the first time, this product will be added to their pending invoice.
   *
   * E.g. for a product "truck insurance fee", this property would be the truck license category, which means that any student that does truck driving training should pay the truck insurance fee.
   */
  @ApiProperty({ enum: LicenseCategory, enumName: 'LicenseCategory' })
  @Column({
    type: 'enum',
    enum: LicenseCategory,
    nullable: true,
  })
  assignedForLicenseCategory?: LicenseCategory;

  constructor(id: string) {
    this.id = id;
  }
}
