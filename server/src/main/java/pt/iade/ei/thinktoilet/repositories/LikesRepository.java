package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.views.Likes;

import java.util.Collection;
import java.util.List;

@Repository
public interface LikesRepository extends CrudRepository<Likes, Integer> {
    List<Likes> findLikesByCommentIdIn(Collection<Integer> commentIds);

    int countLikesByCommentId(int commentId);
}
