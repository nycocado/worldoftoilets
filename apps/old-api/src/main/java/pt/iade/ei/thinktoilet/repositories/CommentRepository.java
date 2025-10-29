package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Comment;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    @EntityGraph(attributePaths = {"interaction", "interaction.toilet"})
    Comment findCommentById(int id);

    @EntityGraph(attributePaths = {"interaction", "interaction.toilet"})
    @Query("SELECT c " +
            "FROM Comment c " +
            "WHERE c.interaction.toilet.id = :toiletId " +
            "ORDER BY c.creationDateTime DESC")
    List<Comment> findCommentsByToiletId(int toiletId);

    @EntityGraph(attributePaths = {"interaction", "interaction.toilet"})
    @Query("SELECT c " +
            "FROM Comment c " +
            "WHERE c.interaction.toilet.id = :toiletId " +
            "ORDER BY c.creationDateTime DESC")
    List<Comment> findCommentsByToiletId(int toiletId, Pageable pageable);

    @EntityGraph(attributePaths = {"interaction", "interaction.toilet"})
    @Query("SELECT c " +
            "FROM Comment c " +
            "LEFT JOIN UserReportComment urc ON c.id = urc.commentId AND urc.userId = :userId " +
            "WHERE c.interaction.toilet.id = :toiletId " +
            "AND urc.userId IS NULL " +
            "ORDER BY CASE WHEN c.interaction.user.id = :userId THEN 0 ELSE 1 END, c.creationDateTime DESC")
    List<Comment> findCommentsByToiletIdForUserId(int toiletId, int userId);

    @EntityGraph(attributePaths = {"interaction", "interaction.toilet"})
    @Query("SELECT c " +
            "FROM Comment c " +
            "LEFT JOIN UserReportComment urc ON c.id = urc.commentId AND urc.userId = :userId " +
            "WHERE c.interaction.toilet.id = :toiletId " +
            "AND urc.userId IS NULL " +
            "ORDER BY CASE WHEN c.interaction.user.id = :userId THEN 0 ELSE 1 END, c.creationDateTime DESC")
    List<Comment> findCommentsByToiletIdForUserId(int toiletId, int userId, Pageable pageable);

    @EntityGraph(attributePaths = {"interaction", "interaction.user"})
    @Query("SELECT c " +
            "FROM Comment c " +
            "WHERE c.interaction.user.id = :userId " +
            "ORDER BY c.creationDateTime DESC")
    List<Comment> findCommentsByUserId(int userId);

    @EntityGraph(attributePaths = {"interaction", "interaction.user"})
    @Query("SELECT c " +
            "FROM Comment c " +
            "WHERE c.interaction.user.id = :userId " +
            "ORDER BY c.creationDateTime DESC")
    List<Comment> findCommentsByUserId(int userId, Pageable pageable);

    boolean existsCommentById(int id);
}
