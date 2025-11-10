import { Injectable } from '@nestjs/common';
import { CommentRateService } from '@modules/comment-rate';
import { ToiletEntity } from '@database/entities';
import { plainToInstance } from 'class-transformer';
import { ToiletResponseDto } from '@modules/toilet/dto/toilet-response.dto';

@Injectable()
export class EnrichToiletsWithCommentRateUseCase {
  constructor(private readonly commentRateService: CommentRateService) {}

  async execute(toilets: ToiletEntity[]): Promise<ToiletResponseDto[]> {
    const ratings =
      await this.commentRateService.getAverageRatingsForToilets(toilets);

    // Converter as entities para plain objects e garantir que extras é um array
    const plainToilets = toilets.map((toilet) => ({
      ...toilet,
      extras: toilet.extras.getItems(),
    }));

    const dto = plainToInstance(ToiletResponseDto, plainToilets, {
      excludeExtraneousValues: true,
    });

    dto.forEach((toiletDto) => {
      const toiletRating = ratings.get(toiletDto.publicId);
      toiletDto.rating = {
        totalRatings: toiletRating?.totalRatings ?? 0,
        avgClean: toiletRating?.avgClean ?? 0,
        avgStructure: toiletRating?.avgStructure ?? 0,
        avgAccessibility: toiletRating?.avgAccessibility ?? 0,
        paperAvailability: toiletRating?.paperAvailability ?? 0,
      };
    });

    return dto;
  }
}
