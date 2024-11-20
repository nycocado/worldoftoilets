package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.views.Dislikes;
import java.util.Collection;
import java.util.List;

@Repository
public interface DislikesRepository extends CrudRepository<Dislikes, Integer> {
    List<Dislikes> findDislikesByCommentIdIn(Collection<Integer> commentIds);

    int countDislikesByCommentId(int commentId);
}
