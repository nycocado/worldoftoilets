package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Comment;

@Repository
public interface CommentPagingRepository extends PagingAndSortingRepository<Comment, Integer> {
    @EntityGraph(attributePaths = {"interaction", "interaction.toilet"})
    Page<Comment> findCommentsByInteractionToiletId(int toiletId, Pageable pageable);

    @EntityGraph(attributePaths = {"interaction", "interaction.user"})
    Page<Comment> findCommentsByInteractionUserId(int userId, Pageable pageable);
}
