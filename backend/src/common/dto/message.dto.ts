import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ example: 'Follow deleted successfully' })
  message!: string;
}
