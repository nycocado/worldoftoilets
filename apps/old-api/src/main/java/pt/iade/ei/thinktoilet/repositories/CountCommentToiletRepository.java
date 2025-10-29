package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.views.CountCommentToilet;

import java.util.List;

@Repository
public interface CountCommentToiletRepository extends CrudRepository<CountCommentToilet, Integer> {
    List<CountCommentToilet> findCountCommentToiletByToiletIdIn(List<Integer> toiletIds);

    CountCommentToilet findCountCommentToiletByToiletId(int toiletId);
}
