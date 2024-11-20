package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.models.dtos.NumObject;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
import pt.iade.ei.thinktoilet.models.entities.Extra;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.views.Rating;
import pt.iade.ei.thinktoilet.repositories.CommentRepository;
import pt.iade.ei.thinktoilet.repositories.ExtraRepository;
import pt.iade.ei.thinktoilet.repositories.RatingRepository;
import pt.iade.ei.thinktoilet.repositories.ToiletRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ToiletService {
    @Autowired
    private ToiletRepository toiletRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ExtraRepository extraRepository;
    @Autowired
    private RatingRepository ratingRepository;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<ToiletDTO> getAllToilets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Toilet> toilets = toiletRepository.findToiletsByOrderById(pageable);

        return getToiletDTOS(toilets);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ToiletDTO getToilet(int id) {
        Toilet toilet = toiletRepository.findToiletById(id);
        List<Extra> extras = extraRepository.findExtrasByToilet_Id(id);
        Rating rating = Optional.ofNullable(ratingRepository.findRatingsByToiletId(toilet.getId())).orElse(new Rating());
        NumObject numComments = Optional.ofNullable(commentRepository.countCommentsByToiletId(id)).orElse(new NumObject());

        return toilet.toDTO(rating, numComments.getNum(), extras);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<ToiletDTO> getToiletsNearby(double lat, double lon, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Toilet> toilets = toiletRepository.findByDistance(lat, lon, pageable);

        return getToiletDTOS(toilets);
    }

    private Page<ToiletDTO> getToiletDTOS(Page<Toilet> toilets) {
        List<Extra> extras = extraRepository.findExtrasByToilet_IdIn(toilets.stream().map(Toilet::getId).toList());
        List<Rating> ratings = ratingRepository.findRatingsByToiletIdIn(toilets.stream().map(Toilet::getId).toList());
        List<NumObject> countComments = commentRepository.countCommentsByToiletIds(toilets.stream().map(Toilet::getId).toList());

        Map<Integer, Rating> ratingMap = ratings.stream()
                .collect(Collectors.toMap(Rating::getToiletId, rating -> rating));
        Map<Integer, Integer> commentCountMap = countComments.stream()
                .collect(Collectors.toMap(NumObject::getId, NumObject::getNum));
        Map<Integer, List<Extra>> extrasMap = extras.stream()
                .collect(Collectors.groupingBy(extra -> extra.getToilet().getId()));

        return toilets.map(toilet -> {
            Rating rating = ratingMap.getOrDefault(toilet.getId(), new Rating());
            int numComments = commentCountMap.getOrDefault(toilet.getId(), 0);
            List<Extra> extrasToilet = extrasMap.getOrDefault(toilet.getId(), List.of());
            return toilet.toDTO(rating, numComments, extrasToilet);
        });
    }
}