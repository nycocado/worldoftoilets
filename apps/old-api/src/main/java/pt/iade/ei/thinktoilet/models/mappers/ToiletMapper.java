package pt.iade.ei.thinktoilet.models.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
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
        List<String> extras = extraRepository.findExtrasByToilet_Id(toilet.getId())
                .stream().map( (Extra extra) -> extra.getTypeExtra().getTechnicalName().toUpperCase().replace("-", "_")).toList();
        String access = toilet.getAccess().getTechnicalName().toUpperCase().replace("-", "_");
        Rating rating = ratingRepository.findRatingByToiletId(toilet.getId());
        CountCommentToilet countComment = countCommentToiletRepository.findCountCommentToiletByToiletId(toilet.getId());
        return new ToiletDTO(
                toilet.getId(),
                toilet.getName(),
                toilet.getAddress(),
                rating,
                extras,
                access,
                toilet.getLatitude(),
                toilet.getLongitude(),
                countComment.getNum(),
                toilet.getPlaceId()
        );
    }

    public List<ToiletDTO> mapToiletDTOS(Collection<Toilet> toilets){
        List<Integer> toiletIds = toilets.stream().map(Toilet::getId).toList();
        List<Extra> extras = extraRepository.findExtrasByToilet_IdIn(toiletIds);
        List<Rating> ratings = ratingRepository.findRatingsByToiletIdIn(toiletIds);
        List<CountCommentToilet> countComments = countCommentToiletRepository.findCountCommentToiletByToiletIdIn(toiletIds);

        Map<Integer, Rating> ratingMap = ratings.stream()
                .collect(Collectors.toMap(Rating::getToiletId, rating -> rating));
        Map<Integer, Integer> commentCountMap = countComments.stream()
                .collect(Collectors.toMap(CountCommentToilet::getToiletId, CountCommentToilet::getNum));
        Map<Integer, List<String>> extrasMap = extras.stream()
                .collect(Collectors.groupingBy(extra -> extra.getToilet().getId(),
                        Collectors.mapping(extra -> extra.getTypeExtra().getTechnicalName().toUpperCase().replace("-", "_"), Collectors.toList())));

        return toilets.stream().map(toilet -> {
            Rating rating = ratingMap.get(toilet.getId());
            int numComments = commentCountMap.get(toilet.getId());
            List<String> extrasToilet = extrasMap.getOrDefault(toilet.getId(), List.of());
            String access = toilet.getAccess().getTechnicalName().toUpperCase().replace("-", "_");
            return new ToiletDTO(
                    toilet.getId(),
                    toilet.getName(),
                    toilet.getAddress(),
                    rating,
                    extrasToilet,
                    access,
                    toilet.getLatitude(),
                    toilet.getLongitude(),
                    numComments,
                    toilet.getPlaceId()
            );
        }).toList();
    }

}
