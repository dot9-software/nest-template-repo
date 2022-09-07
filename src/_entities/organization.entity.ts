import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillingType } from './billing-type.entity';
import { WorkEvent } from './work-event.entity';
import { User, formattedMonth } from './user.entity';
import { Student } from './student.entity';
import { Syllabus } from './syllabus.entity';
import { Vehicle } from './vehicle.entity';
import { Invoice } from './invoice.entity';
import { BankingInfo, ContactInfo } from './organization-metadata.entity';
import { InvoiceType } from './invoice-type.entity';
import Timezone from 'timezone-enum';

export const stringArrayMap = {
  type: 'object',
  additionalProperties: {
    oneOf: [{ type: 'array', items: { type: 'number' } }],
  },
};

export type yearMonth = `${number}-${formattedMonth}`;

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  /**
   * Number of vacation days that each user of this organization has per year
   */
  @Column({ nullable: false, default: 25 })
  @ApiProperty({
    type: Number,
    minimum: 0,
    maximum: 365,
  })
  annual_vacation_days: number;

  /**
   * Holidays within this organization (e.g. christmas) that are ignored on Time-Tracking stored as a map of months
   * in the format "YYYY-MM" to an array of numbers that represent the dates that are holidays for this organization
   */
  @Column({ nullable: true, type: 'json' })
  @ApiProperty(stringArrayMap)
  holidays?: Map<yearMonth, number[]>;

  /**
   * Number of hours an employee with a worktime percentage of 100% should work per day
   */
  @Column({ nullable: false, type: 'float' })
  @ApiProperty({
    type: Number,
    minimum: 0,
  })
  full_time_hours: number;

  @Column(() => ContactInfo)
  @ApiProperty({ type: ContactInfo })
  contact_info: ContactInfo;

  @Column(() => BankingInfo)
  @ApiProperty({ type: BankingInfo })
  banking_info: BankingInfo;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Timezone,
    default: Timezone['Europe/Berlin'],
  })
  timezone: Timezone;

  @OneToMany(() => InvoiceType, (invoiceType) => invoiceType.organization)
  invoiceTypes?: InvoiceType[];

  @OneToMany(() => Student, (student) => student.organization)
  students?: Student[];

  @OneToMany(() => User, (i) => i.organization)
  users?: User[];

  @OneToMany(() => Syllabus, (i) => i.organization)
  syllabuses?: Syllabus[];

  @OneToMany(() => BillingType, (i) => i.organization)
  billingTypes?: BillingType[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.organization)
  vehicles?: Vehicle[];

  @OneToMany(() => WorkEvent, (event) => event.organization)
  calendarEvents?: WorkEvent[];

  @OneToMany(() => Invoice, (i) => i.organization, { nullable: true })
  invoices?: Invoice[];

  constructor(id: string) {
    this.id = id;
  }
}
