import { ReactService } from '@modules/react';
import { UserService } from '@modules/user';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactDiscriminator } from '@database/entities';
import { CommentResponseDto } from '@modules/comment/dto';
import { CommentRepository } from '@modules/comment/comment.repository';
import { COMMENT_EXCEPTIONS } from '@modules/comment/constants/exceptions.constant';
import { plainToInstance } from 'class-transformer';

/**
 * Contém a lógica de negócio para adicionar, remover ou alterar uma reação a um comentário.
 */
@Injectable()
export class PutReactUseCase {
  constructor(
    private readonly repository: CommentRepository,
    private readonly userService: UserService,
    private readonly reactService: ReactService,
  ) {}

  /**
   * Adiciona, remove ou altera uma reação (like/dislike) a um comentário.
   *
   * @param {string} publicId O ID público do utilizador.
   * @param {string} commentPublicId O ID público do comentário.
   * @param {ReactDiscriminator} discriminator O tipo de reação (like/dislike).
   * @returns {Promise<CommentResponseDto>} O DTO do comentário com as reações atualizadas.
   * @throws {NotFoundException} Se o comentário não for encontrado.
   */
  async execute(
    publicId: string,
    commentPublicId: string,
    discriminator: ReactDiscriminator,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getUserByPublicId(publicId);
    const comment = await this.repository.findByPublicId(commentPublicId);

    if (!comment) {
      throw new NotFoundException(COMMENT_EXCEPTIONS.COMMENT_NOT_FOUND);
    }

    const react = await this.reactService.getReactByUserAndComment(
      user,
      comment,
    );

    if (!react) {
      await this.reactService.createReact(user, comment, discriminator);
    }

    if (react && react.discriminator === discriminator) {
      await this.reactService.deleteReact(react);
    }

    if (react && react.discriminator !== discriminator) {
      await this.reactService.updateReact(react, discriminator);
    }

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
