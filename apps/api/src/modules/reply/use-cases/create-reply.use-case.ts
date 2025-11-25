import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserService } from '@modules/user';
import { CommentService } from '@modules/comment';
import { Transactional } from '@mikro-orm/mariadb';
import { ReplyRepository } from '@modules/reply/reply.repository';
import { ReplyResponseDto } from '@modules/reply/dto';
import { plainToInstance } from 'class-transformer';
import { REPLY_EXCEPTIONS } from '@modules/reply/constants/exceptions.constant';
import { PartnerStatus } from '@database/entities';

/**
 * Contém a lógica de negócio para a criação de uma nova resposta.
 */
@Injectable()
export class CreateReplyUseCase {
  constructor(
    private readonly repository: ReplyRepository,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  /**
   * Cria uma nova resposta para um comentário.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @param {string} commentPublicId O ID público do comentário.
   * @param {string} text O texto da resposta.
   * @returns {Promise<ReplyResponseDto>} O DTO da resposta criada.
   * @throws {NotFoundException} Se o utilizador ou o comentário não forem encontrados.
   * @throws {ForbiddenException} Se o utilizador for partner e o comentário não estiver na sua toilet.
   */
  @Transactional()
  async execute(
    userPublicId: string,
    commentPublicId: string,
    text: string,
  ): Promise<ReplyResponseDto> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const comment =
      await this.commentService.getCommentByPublicId(commentPublicId);

    const partner = user.partner;

    if (partner && partner.status === PartnerStatus.ACTIVE) {
      const commentToiletPublicId = comment.interaction.toilet.publicId;
      const partnerToiletPublicId = partner.toilet.publicId;

      if (commentToiletPublicId !== partnerToiletPublicId) {
        throw new ForbiddenException(
          REPLY_EXCEPTIONS.PARTNER_CAN_ONLY_REPLY_TO_OWN_TOILET,
        );
      }
    }

    const reply = await this.repository.create(comment, user, text);

    return plainToInstance(ReplyResponseDto, reply, {
      excludeExtraneousValues: true,
    });
  }
}
