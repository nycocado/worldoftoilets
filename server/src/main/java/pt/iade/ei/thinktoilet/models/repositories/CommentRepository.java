package pt.iade.ei.thinktoilet.models.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Comment;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Integer> {

}
