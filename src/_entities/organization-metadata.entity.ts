import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';
import { IsAddress } from '../validators/IsAddress';
import { Address } from './address.entity';

/**
 * All banking information of an organization that is used to generate invoices etc.
 */
export class BankingInfo {
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  account_owner?: string;

  @IsString()
  @MaxLength(6)
  @MinLength(6)
  @Column({ nullable: true })
  qr_customer_identification_number?: string;

  @Column({ nullable: true })
  @IsString()
  qr_iban?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  iban?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  bic?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  name_of_bank?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  vat_id?: string;
}

/**
 * Contact information of the organization that is included for example on exported invoices and mails
 */
export class ContactInfo {
  @Column(() => Address)
  @ApiProperty({ type: Address })
  @IsAddress()
  address: Address;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsPhoneNumber('CH')
  @IsString()
  telephoneNum?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  website?: string;
}
