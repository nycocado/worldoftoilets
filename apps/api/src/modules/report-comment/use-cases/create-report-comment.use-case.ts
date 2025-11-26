import { ConflictException, Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportCommentRepository } from '../report-comment.repository';
import { UserService } from '@modules/user';
import { CommentService } from '@modules/comment';
import { ReactService } from '@modules/react';
import { TypeReportCommentService } from '@modules/type-report-comment';
import { ReportCommentResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import {
  ReactDiscriminator,
  TypeReportCommentApiName,
} from '@database/entities';
import { REPORT_COMMENT_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para criar uma denúncia de comentário.
 */
@Injectable()
export class CreateReportCommentUseCase {
  constructor(
    private readonly repository: ReportCommentRepository,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
    private readonly reactService: ReactService,
    private readonly typeReportCommentService: TypeReportCommentService,
  ) {}

  /**
   * Cria uma denúncia de comentário.
   *
   * @param {string} userPublicId O ID público do utilizador que está a denunciar.
   * @param {string} commentPublicId O ID público do comentário a ser denunciado.
   * @param {TypeReportCommentApiName} typeReportCommentApiName O tipo de denúncia.
   * @returns {Promise<ReportCommentResponseDto>} A denúncia criada.
   * @throws {NotFoundException} Se o utilizador, comentário ou tipo de denúncia não forem encontrados.
   * @throws {ConflictException} Se o utilizador já denunciou este comentário.
   */
  @Transactional()
  async execute(
    userPublicId: string,
    commentPublicId: string,
    typeReportCommentApiName: TypeReportCommentApiName,
  ): Promise<ReportCommentResponseDto> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const comment =
      await this.commentService.getCommentByPublicId(commentPublicId);
    const typeReportComment =
      await this.typeReportCommentService.getTypeReportCommentByApiName(
        typeReportCommentApiName,
      );

    // Verificar se já existe uma denúncia (react com discriminador REPORT)
    const existingReact = await this.reactService.getReactByUserAndComment(
      user,
      comment,
    );

    if (
      existingReact &&
      existingReact.discriminator === ReactDiscriminator.REPORT
    ) {
      throw new ConflictException(
        REPORT_COMMENT_EXCEPTIONS.COMMENT_ALREADY_REPORTED,
      );
    }

    // Criar ou atualizar o react para REPORT
    let react;
    if (existingReact) {
      react = await this.reactService.updateReact(
        existingReact,
        ReactDiscriminator.REPORT,
      );
    } else {
      react = await this.reactService.createReact(
        user,
        comment,
        ReactDiscriminator.REPORT,
      );
    }

    const report = await this.repository.create(react, typeReportComment);

    return plainToInstance(ReportCommentResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
