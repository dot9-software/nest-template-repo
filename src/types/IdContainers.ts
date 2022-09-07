import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * Simple class containing an id, for class validation purposes
 */

export class UserIdContainer {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

/**
 * Simple class containing an id that is an uuid, for class validation purposes
 */
export class UUIDContainer {
  @ApiProperty()
  @IsUUID()
  id: string;
}
