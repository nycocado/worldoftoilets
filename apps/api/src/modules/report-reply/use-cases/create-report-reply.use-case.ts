import { Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportReplyRepository } from '../report-reply.repository';
import { UserService } from '@modules/user';
import { ReplyService } from '@modules/reply';
import { TypeReportReplyService } from '@modules/type-report-reply';
import { ReportReplyResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { TypeReportReplyApiName } from '@database/entities';

/**
 * Contém a lógica de negócio para criar uma denúncia de resposta.
 */
@Injectable()
export class CreateReportReplyUseCase {
  constructor(
    private readonly repository: ReportReplyRepository,
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
    private readonly typeReportReplyService: TypeReportReplyService,
  ) {}

  /**
   * Cria uma denúncia de resposta.
   *
   * @param {string} userPublicId O ID público do utilizador que está a denunciar.
   * @param {string} replyPublicId O ID público da resposta a ser denunciada.
   * @param {TypeReportReplyApiName} typeReportReplyApiName O tipo de denúncia.
   * @returns {Promise<ReportReplyResponseDto>} A denúncia criada.
   * @throws {NotFoundException} Se o utilizador, resposta ou tipo de denúncia não forem encontrados.
   * @throws {ConflictException} Se o utilizador já denunciou esta resposta.
   */
  @Transactional()
  async execute(
    userPublicId: string,
    replyPublicId: string,
    typeReportReplyApiName: TypeReportReplyApiName,
  ): Promise<ReportReplyResponseDto> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const reply = await this.replyService.getReplyByPublicId(replyPublicId);
    const typeReportReply =
      await this.typeReportReplyService.getTypeReportReplyByApiName(
        typeReportReplyApiName,
      );

    const report = await this.repository.create(user, reply, typeReportReply);

    return plainToInstance(ReportReplyResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
