import { ApiProperty } from '@nestjs/swagger';

export class VehicleInfo {
  @ApiProperty({ required: false })
  engine?: string;

  @ApiProperty({ required: false })
  manufacturer?: string;

  @ApiProperty({
    type: 'enum',
    enum: ['automatic', 'manual'],
    enumName: 'GearType',
    required: false,
  })
  gearType?: 'automatic' | 'manual';

  @ApiProperty({ required: false })
  firstDriven?: Date;

  @ApiProperty({
    type: 'enum',
    enum: ['owned', 'leasing'],
    enumName: 'OwnershipType',
    required: false,
  })
  ownershipType?: 'owned' | 'leasing';

  /**
   * For leasing vehicles, this is the date on which the leasing contract ends
   */
  @ApiProperty({ required: false })
  endOfLeasingContract?: Date;
}
