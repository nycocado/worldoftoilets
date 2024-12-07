package pt.iade.ei.thinktoilet.models.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
import pt.iade.ei.thinktoilet.models.entities.Extra;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.entities.TypeExtra;
import pt.iade.ei.thinktoilet.models.views.CountCommentToilet;
import pt.iade.ei.thinktoilet.models.views.Rating;
import pt.iade.ei.thinktoilet.repositories.CountCommentToiletRepository;
import pt.iade.ei.thinktoilet.repositories.ExtraRepository;
import pt.iade.ei.thinktoilet.repositories.RatingRepository;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ToiletMapper {
    @Autowired
    ExtraRepository extraRepository;
    @Autowired
    RatingRepository ratingRepository;
    @Autowired
    CountCommentToiletRepository countCommentToiletRepository;

    public ToiletDTO mapToiletDTO(Toilet toilet){
        List<Extra> extras = Optional.ofNullable(extraRepository.findExtrasByToilet_Id(toilet.getId()))
                .orElseThrow(() -> new NotFoundException("Extra", "Toilet", "id"));
        Rating rating = Optional.ofNullable(ratingRepository.findRatingByToiletId(toilet.getId()))
                .orElse(new Rating(toilet.getId(), 0f, 0f, 0f, 0f));
        CountCommentToilet countComment = Optional.ofNullable(countCommentToiletRepository.findCountCommentToiletByToiletId(toilet.getId()))
                .orElse(new CountCommentToilet(toilet.getId(), 0));
        List<TypeExtra> extrasToilet = extras.stream().map(Extra::getTypeExtra).toList();
        return new ToiletDTO(
                toilet.getId(),
                toilet.getName(),
                toilet.getAddress(),
                rating,
                extrasToilet,
                toilet.getLatitude(),
                toilet.getLongitude(),
                countComment.getNum(),
                toilet.getPlaceId()
        );
    }

    public List<ToiletDTO> mapToiletDTOS(Collection<Toilet> toilets){
        List<Integer> toiletIds = toilets.stream().map(Toilet::getId).toList();
        List<Extra> extras = Optional.ofNullable(extraRepository.findExtrasByToilet_IdIn(toiletIds))
                .orElseThrow(() -> new NotFoundException("Extra", "Toilet", "ids"));
        List<Rating> ratings = Optional.ofNullable(ratingRepository.findRatingsByToiletIdIn(toiletIds))
                .orElseThrow(() -> new NotFoundException("Rating", "Toilet", "ids"));
        List<CountCommentToilet> countComments = Optional.ofNullable(countCommentToiletRepository.findCountCommentToiletByToiletIdIn(toiletIds))
                .orElseThrow(() -> new NotFoundException("CountCommentToilet", "Toilet", "ids"));

        Map<Integer, Rating> ratingMap = ratings.stream()
                .collect(Collectors.toMap(Rating::getToiletId, rating -> rating));
        Map<Integer, Integer> commentCountMap = countComments.stream()
                .collect(Collectors.toMap(CountCommentToilet::getToiletId, CountCommentToilet::getNum));
        Map<Integer, List<TypeExtra>> extrasMap = extras.stream()
                .collect(Collectors.groupingBy(extra -> extra.getToilet().getId(), Collectors.mapping(Extra::getTypeExtra, Collectors.toList())));

        return toilets.stream().map(toilet -> {
            Rating rating = ratingMap.getOrDefault(toilet.getId(), new Rating());
            int numComments = commentCountMap.getOrDefault(toilet.getId(), 0);
            List<TypeExtra> extrasToilet = extrasMap.getOrDefault(toilet.getId(), List.of());
            return new ToiletDTO(
                    toilet.getId(),
                    toilet.getName(),
                    toilet.getAddress(),
                    rating,
                    extrasToilet,
                    toilet.getLatitude(),
                    toilet.getLongitude(),
                    numComments,
                    toilet.getPlaceId()
            );
        }).toList();
    }

}
