import { IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class Address {
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  street?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  number?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  zip?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;
}

export class FullAddress extends Address {
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  addressee?: string;
}
