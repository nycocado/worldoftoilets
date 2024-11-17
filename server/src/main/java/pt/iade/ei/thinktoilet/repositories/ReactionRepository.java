package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.dtos.NumObject;
import pt.iade.ei.thinktoilet.models.entities.Reaction;
import java.util.List;

@Repository
public interface ReactionRepository extends CrudRepository<Reaction, Integer> {
    @Query("SELECT new pt.iade.ei.thinktoilet.models.dtos.NumObject(r.comment.id, CAST(count(*) AS int)) " +
            "FROM Reaction r " +
            "WHERE r.comment.id IN :commentsIds AND r.typeReaction.id = 1 " +
            "GROUP BY r.comment.id")
    List<NumObject> countLikesByCommentsIds(List<Integer> commentsIds);

    @Query("SELECT CAST(count(*) AS int) " +
            "FROM Reaction r " +
            "WHERE r.comment.id = :commentId AND r.typeReaction.id = 1")
    int countLikesByCommentId(int commentId);

    @Query("SELECT new pt.iade.ei.thinktoilet.models.dtos.NumObject(r.comment.id, CAST(count(*) AS int)) " +
            "FROM Reaction r " +
            "WHERE r.comment.id IN :commentsIds AND r.typeReaction.id = 2 " +
            "GROUP BY r.comment.id")
    List<NumObject> countDislikesByCommentsIds(List<Integer> commentsIds);

    @Query("SELECT CAST(count(*) AS int) " +
            "FROM Reaction r " +
            "WHERE r.comment.id = :commentId AND r.typeReaction.id = 2")
    int countDislikesByCommentId(int commentId);
}
