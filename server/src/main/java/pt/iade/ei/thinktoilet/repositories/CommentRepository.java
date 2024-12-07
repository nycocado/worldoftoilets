package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Comment;

import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Integer> {
    @EntityGraph(attributePaths = {"interaction", "interaction.toilet"})
    Comment findCommentById(int id);

    @EntityGraph(attributePaths = {"interaction", "interaction.toilet"})
    List<Comment> findCommentsByInteractionToiletId(int toiletId);

    @EntityGraph(attributePaths = {"interaction", "interaction.user"})
    List<Comment> findCommentsByInteractionUserId(int userId);
}
