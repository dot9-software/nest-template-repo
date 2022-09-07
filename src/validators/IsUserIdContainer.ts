import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsObject, ValidateNested } from 'class-validator';
import { UserIdContainer } from '../types/IdContainers';

export function IsUserIdContainer() {
  return applyDecorators(
    IsDefined(),
    ValidateNested(),
    IsObject(),
    Type(() => UserIdContainer),
  );
}
