package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.models.dtos.NumObject;
import pt.iade.ei.thinktoilet.models.dtos.RatingCategory;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
import pt.iade.ei.thinktoilet.models.entities.Extra;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.repositories.CommentRepository;
import pt.iade.ei.thinktoilet.repositories.ExtraRepository;
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
        RatingCategory rating = Optional.ofNullable(commentRepository.findAverageRatingByToiletId(id)).orElse(new RatingCategory());
        NumObject numComments = Optional.ofNullable(commentRepository.countCommentsByToiletId(id)).orElse(new NumObject());

        return toilet.toDTO(rating.toDTO(), numComments.getNum(), extras);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<ToiletDTO> getToiletsNearby(double lat, double lon, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Toilet> toilets = toiletRepository.findByDistance(lat, lon, pageable);

        return getToiletDTOS(toilets);
    }

    private Page<ToiletDTO> getToiletDTOS(Page<Toilet> toilets) {
        List<Extra> extras = extraRepository.findExtrasByToilet_IdIn(toilets.stream().map(Toilet::getId).toList());
        List<RatingCategory> ratings = commentRepository.findAverageRatingByToiletIds(toilets.stream().map(Toilet::getId).toList());
        List<NumObject> countComments = commentRepository.countCommentsByToiletIds(toilets.stream().map(Toilet::getId).toList());

        Map<Integer, RatingCategory> ratingMap = ratings.stream()
                .collect(Collectors.toMap(RatingCategory::getId, rating -> rating));
        Map<Integer, Integer> commentCountMap = countComments.stream()
                .collect(Collectors.toMap(NumObject::getId, NumObject::getNum));
        Map<Integer, List<Extra>> extrasMap = extras.stream()
                .collect(Collectors.groupingBy(extra -> extra.getToilet().getId()));

        return toilets.map(toilet -> {
            RatingCategory rating = ratingMap.getOrDefault(toilet.getId(), new RatingCategory());
            int numComments = commentCountMap.getOrDefault(toilet.getId(), 0);
            List<Extra> extrasToilet = extrasMap.getOrDefault(toilet.getId(), List.of());
            return toilet.toDTO(rating.toDTO(), numComments, extrasToilet);
        });
    }
}