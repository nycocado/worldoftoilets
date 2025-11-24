import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserBaseDto } from '@modules/user/dto/user-base.dto';

/**
 * DTO para a resposta com os dados do autor de um comentário.
 */
export class UserCommentResponseDto extends UserBaseDto {
  @ApiProperty({
    description: 'Os pontos de gamificação do utilizador.',
    example: 150,
  })
  @Expose()
  @Type(() => Number)
  points!: number;

  @ApiProperty({
    description: 'Indica se o utilizador é um parceiro verificado.',
    example: false,
  })
  @Expose()
  @Type(() => Boolean)
  isPartner!: boolean;
}
