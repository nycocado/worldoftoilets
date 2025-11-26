import { ConflictException, Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/mariadb';
import { ReportToiletRepository } from '@modules/report-toilet';
import { UserService } from '@modules/user';
import { ToiletService } from '@modules/toilet';
import { InteractionService } from '@modules/interaction';
import { TypeReportToiletService } from '@modules/type-report-toilet';
import { ReportToiletResponseDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import {
  InteractionDiscriminator,
  TypeReportToiletApiName,
} from '@database/entities';
import { REPORT_TOILET_EXCEPTIONS } from '../constants';

/**
 * Contém a lógica de negócio para criar uma denúncia de casa de banho.
 */
@Injectable()
export class CreateReportToiletUseCase {
  constructor(
    private readonly repository: ReportToiletRepository,
    private readonly userService: UserService,
    private readonly toiletService: ToiletService,
    private readonly interactionService: InteractionService,
    private readonly typeReportToiletService: TypeReportToiletService,
  ) {}

  /**
   * Cria uma nova denúncia de casa de banho.
   *
   * @param {string} userPublicId O ID público do utilizador.
   * @param {string} toiletPublicId O ID público da casa de banho.
   * @param {TypeReportToiletApiName} typeReportToiletApiName O tipo de denúncia.
   * @returns {Promise<ReportToiletResponseDto>} A denúncia criada.
   * @throws {NotFoundException} Se o utilizador, casa de banho ou tipo não forem encontrados.
   * @throws {ConflictException} Se o utilizador já denunciou esta casa de banho.
   */
  @Transactional()
  async execute(
    userPublicId: string,
    toiletPublicId: string,
    typeReportToiletApiName: TypeReportToiletApiName,
  ): Promise<ReportToiletResponseDto> {
    const user = await this.userService.getUserByPublicId(userPublicId);
    const toilet = await this.toiletService.getToiletByPublicId(toiletPublicId);
    const typeReportToilet =
      await this.typeReportToiletService.getTypeReportToiletByApiName(
        typeReportToiletApiName,
      );

    const existingInteraction = await this.interactionService.findInteraction(
      user,
      toilet,
      InteractionDiscriminator.REPORT,
    );

    if (existingInteraction) {
      throw new ConflictException(
        REPORT_TOILET_EXCEPTIONS.TOILET_ALREADY_REPORTED,
      );
    }

    const interaction = await this.interactionService.createInteraction(
      user,
      toilet,
      InteractionDiscriminator.REPORT,
    );

    const report = await this.repository.create(interaction, typeReportToilet);

    return plainToInstance(ReportToiletResponseDto, report, {
      excludeExtraneousValues: true,
    });
  }
}
