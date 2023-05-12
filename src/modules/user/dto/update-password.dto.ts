import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  new_password: string;

  @IsNotEmpty()
  @ApiProperty()
  old_password: string;
}
