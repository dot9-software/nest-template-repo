import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Student } from './student.entity';

@Entity()
export class StudentGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => Student, (s) => s.groups, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  students?: Student[];

  @ManyToOne(() => Organization)
  organization: Organization;

  constructor(id: string) {
    this.id = id;
  }
}
