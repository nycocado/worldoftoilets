import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportUserRepository } from '../report-user.repository';
import { UserService } from '@modules/user';
import { TypeReportUserService } from '@modules/type-report-user';
import { ReportUserResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { TypeReportUserApiName } from '@database/entities';
import { REPORT_USER_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para criar uma denúncia de utilizador.
 */
@Injectable()
export class CreateReportUserUseCase {
  constructor(
    private readonly repository: ReportUserRepository,
    private readonly userService: UserService,
    private readonly typeReportUserService: TypeReportUserService,
  ) {}

  /**
   * Cria uma denúncia de utilizador.
   *
   * @param {string} userReporterPublicId O ID público do utilizador que está a denunciar.
   * @param {string} userReportedPublicId O ID público do utilizador a ser denunciado.
   * @param {TypeReportUserApiName} typeReportUserApiName O tipo de denúncia.
   * @returns {Promise<ReportUserResponseDto>} A denúncia criada.
   * @throws {NotFoundException} Se o utilizador ou tipo de denúncia não forem encontrados.
   * @throws {BadRequestException} Se o utilizador tentar denunciar a si próprio.
   * @throws {ConflictException} Se o utilizador já denunciou este utilizador com o mesmo tipo.
   */
  @Transactional()
  async execute(
    userReporterPublicId: string,
    userReportedPublicId: string,
    typeReportUserApiName: TypeReportUserApiName,
  ): Promise<ReportUserResponseDto> {
    const userReporter =
      await this.userService.getUserByPublicId(userReporterPublicId);
    const userReported =
      await this.userService.getUserByPublicId(userReportedPublicId);
    const typeReportUser =
      await this.typeReportUserService.getTypeReportUserByApiName(
        typeReportUserApiName,
      );

    // Verificar se está a tentar denunciar a si próprio
    if (userReporter.id === userReported.id) {
      throw new BadRequestException(REPORT_USER_EXCEPTIONS.CANNOT_REPORT_SELF);
    }

    const report = await this.repository.create(
      userReporter,
      userReported,
      typeReportUser,
    );

    return plainToInstance(ReportUserResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
