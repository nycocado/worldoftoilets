package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;
import pt.iade.ei.thinktoilet.models.entities.Reaction;

import java.util.Collection;
import java.util.List;

public interface ReactionRepository extends CrudRepository<Reaction, Integer> {
    @EntityGraph(attributePaths = {"typeReaction"})
    Reaction findReactionByCommentIdAndUserId(int commentId, int userId);

    @EntityGraph(attributePaths = {"typeReaction"})
    List<Reaction> findReactionsByUser_IdAndComment_IdIn(int userId, Collection<Integer> commentIds);
}
