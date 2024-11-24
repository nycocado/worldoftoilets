package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
import pt.iade.ei.thinktoilet.models.entities.Extra;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.entities.TypeExtra;
import pt.iade.ei.thinktoilet.models.views.CountCommentToilet;
import pt.iade.ei.thinktoilet.models.views.Rating;
import pt.iade.ei.thinktoilet.repositories.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ToiletService {
    @Autowired
    private ToiletRepository toiletRepository;
    @Autowired
    private ToiletPagingRepository toiletPagingRepository;
    @Autowired
    private ExtraRepository extraRepository;
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private CountCommentToiletRepository countCommentToiletRepository;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public List<ToiletDTO> getAllToilets(){
        List<Toilet> toilets = toiletRepository.findToiletsByOrderById();
        return mapToiletDTOS(toilets);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<ToiletDTO> getAllToiletsPaging(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Toilet> toilets = toiletPagingRepository.findToiletsByOrderById(pageable);
        List<Toilet> toiletsList = toilets.toList();

        return new PageImpl<>(mapToiletDTOS(toiletsList), pageable, toilets.getTotalElements());
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ToiletDTO getToilet(int id) {
        Toilet toilet = Optional.ofNullable(toiletRepository.findToiletById(id)).orElseThrow(() -> new NotFoundException(String.valueOf(id), "Toilet", "id"));
        List<TypeExtra> typeExtras = extraRepository.findExtrasByToilet_Id(id).stream().map(Extra::getTypeExtra).toList();
        Rating rating = Optional.ofNullable(ratingRepository.findRatingsByToiletId(toilet.getId())).orElse(new Rating());
        CountCommentToilet numComments = Optional.ofNullable(countCommentToiletRepository.findCountCommentToiletByToiletId(toilet.getId())).orElse(new CountCommentToilet());

        return new ToiletDTO(
                toilet.getId(),
                toilet.getName(),
                toilet.getAddress(),
                rating,
                typeExtras,
                toilet.getLatitude(),
                toilet.getLongitude(),
                numComments.getComments(),
                toilet.getPlaceId(),
                toilet.getImage()
        );
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public List<ToiletDTO> getToiletsNearby(double lat, double lon) {
        List<Toilet> toilets = toiletRepository.findByDistance(lat, lon);
        return mapToiletDTOS(toilets);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<ToiletDTO> getToiletsNearbyPaging(double lat, double lon, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Toilet> toilets = toiletPagingRepository.findByDistance(lat, lon, pageable);
        List<Toilet> toiletsList = toilets.toList();

        return new PageImpl<>(mapToiletDTOS(toiletsList), pageable, toilets.getTotalElements());
    }

    private <T> List<ToiletDTO> mapToiletDTOS(Collection<Toilet> toilets){
        List<Integer> toiletIds = toilets.stream().map(Toilet::getId).toList();
        List<Extra> extras = extraRepository.findExtrasByToilet_IdIn(toiletIds);
        List<Rating> ratings = ratingRepository.findRatingsByToiletIdIn(toiletIds);
        List<CountCommentToilet> countComments = countCommentToiletRepository.findCountCommentToiletByToiletIdIn(toiletIds);

        Map<Integer, Rating> ratingMap = ratings.stream()
                .collect(Collectors.toMap(Rating::getToiletId, rating -> rating));
        Map<Integer, Integer> commentCountMap = countComments.stream()
                .collect(Collectors.toMap(CountCommentToilet::getToiletId, CountCommentToilet::getComments));
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
                    toilet.getPlaceId(),
                    toilet.getImage()
            );
        }).toList();
    }
}