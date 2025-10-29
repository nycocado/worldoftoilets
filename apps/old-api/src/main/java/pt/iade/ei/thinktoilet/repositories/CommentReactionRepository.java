package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.views.CommentReaction;

import java.util.Collection;
import java.util.List;

@Repository
public interface CommentReactionRepository extends CrudRepository<CommentReaction, Integer> {
    List<CommentReaction> findCommentReactionsByCommentIdIn(Collection<Integer> commentIds);

    CommentReaction findCommentReactionByCommentId(int commentId);
}
