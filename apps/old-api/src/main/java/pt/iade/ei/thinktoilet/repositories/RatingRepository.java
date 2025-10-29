package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.views.Rating;

import java.util.Collection;
import java.util.List;

@Repository
public interface RatingRepository extends CrudRepository<Rating, Integer> {
    List<Rating> findRatingsByToiletIdIn(Collection<Integer> toiletIds);

    Rating findRatingByToiletId(int toiletId);
}
