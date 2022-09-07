import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { LicenseCategory } from './common/license-category';
import { Organization } from './organization.entity';

class Section {
  title: string;
  lesson_ids: string[];
}

/*
 * A Syllabus is a course consisting of lessons, i.e.
 * The 'Führerschein B' syllabus consists of 'Rechtsvortritt', 'Schulterblick', etc...
 * See http://go/tr-syllabus-screenshot for a visualisation.
 */
@Entity()
export class Syllabus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @ApiProperty({ enum: LicenseCategory, enumName: 'LicenseCategory' })
  @Column({
    type: 'enum',
    enum: LicenseCategory,
    default: LicenseCategory.CAR_B,
    nullable: false,
  })
  licenseCategory: LicenseCategory;

  /**
   * The lessons within this syllabus, e.g. "parallel parking" on "car driver's license"
   */
  @OneToMany(() => Lesson, (l) => l.syllabus, { nullable: true })
  lessons?: Lesson[];

  @ManyToOne(() => Organization, (org) => org.syllabuses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  organization: Organization;

  /**
   * The sections that this syllabus is structured into
   * E.g. a syllabus might be structured into "basic techniques" -> "starting the car, stopping the car", "advanced techniques" -> "driving on a highway" and "mechanical knowledge" -> "oil changes"
   */
  @ApiProperty({ type: Section, isArray: true })
  @Column({ type: 'json', nullable: true })
  sections?: Section[];

  constructor(id: string) {
    this.id = id;
  }
}
