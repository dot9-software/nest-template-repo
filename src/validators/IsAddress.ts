import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsObject, ValidateNested } from 'class-validator';
import { Address } from '../_entities/address.entity';

export function IsAddress() {
  return applyDecorators(
    IsDefined(),
    ValidateNested(),
    IsObject(),
    Type(() => Address),
  );
}
