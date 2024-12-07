package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import pt.iade.ei.thinktoilet.models.entities.Reaction;

public interface ReactionRepository extends CrudRepository<Reaction, Integer> {
    Reaction findReactionByCommentIdAndUserId(int commentId, int userId);
}
