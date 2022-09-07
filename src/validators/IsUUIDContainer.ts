import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsObject, ValidateNested } from 'class-validator';
import { UUIDContainer } from '../types/IdContainers';

export function IsUUIDContainer() {
  return applyDecorators(
    IsDefined(),
    ValidateNested(),
    IsObject(),
    Type(() => UUIDContainer),
  );
}
