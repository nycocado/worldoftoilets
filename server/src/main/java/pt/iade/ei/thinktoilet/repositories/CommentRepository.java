package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.dtos.NumObject;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Integer> {
    @Query("SELECT new pt.iade.ei.thinktoilet.models.dtos.NumObject(c.interaction.toilet.id, CAST(COUNT(c) AS int)) " +
            "FROM Comment c " +
            "WHERE c.interaction.toilet.id IN :toiletIds " +
            "GROUP BY c.interaction.toilet.id")
    List<NumObject> countCommentsByToiletIds(List<Integer> toiletIds);

    @Query("SELECT new pt.iade.ei.thinktoilet.models.dtos.NumObject(c.interaction.toilet.id, CAST(COUNT(c) AS int)) " +
            "FROM Comment c " +
            "WHERE c.interaction.toilet.id = :toiletId " +
            "GROUP BY c.interaction.toilet.id")
    NumObject countCommentsByToiletId(int toiletId);

    @EntityGraph(attributePaths = {"interaction", "interaction.toilet", "interaction.toilet.access", "interaction.toilet.city", "interaction.toilet.city.country"})
    @Query("SELECT c " +
            "FROM Comment c " +
            "LEFT JOIN FETCH c.interaction i " +
            "LEFT JOIN FETCH i.toilet t " +
            "WHERE t.id = :toiletId")
    Page<Comment> findCommentsByToiletId(int toiletId, Pageable pageable);

    @Query("SELECT new pt.iade.ei.thinktoilet.models.dtos.NumObject(c.interaction.user.id, CAST(COUNT(c) AS int)) " +
            "FROM Comment c " +
            "WHERE c.interaction.user.id IN :userId " +
            "GROUP BY c.interaction.user.id")
    NumObject countCommentsByUserId(int userId);

    @EntityGraph(attributePaths = {"interaction", "interaction.user"})
    @Query("SELECT c " +
            "FROM Comment c " +
            "WHERE c.interaction.user.id = :userId")
    Page<Comment> findCommentsByUserId(int userId, Pageable pageable);
}
