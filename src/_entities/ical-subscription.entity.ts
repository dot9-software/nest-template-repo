import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TailwindColor } from './common/colors';
import { User } from './user.entity';

@Entity()
export class ICalSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  subscriptionUrl: string;

  @ApiProperty({ enum: TailwindColor, enumName: 'Color' })
  @Column({
    type: 'enum',
    enum: TailwindColor,
    nullable: false,
    default: TailwindColor.blue,
  })
  display_color: TailwindColor;

  @ManyToOne(() => User, (user) => user.icalSubscriptions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  constructor(id: string) {
    this.id = id;
  }
}
