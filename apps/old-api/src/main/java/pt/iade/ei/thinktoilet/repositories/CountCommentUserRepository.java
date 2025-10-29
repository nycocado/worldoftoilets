package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.views.CountCommentUser;

import java.util.List;

@Repository
public interface CountCommentUserRepository extends CrudRepository<CountCommentUser, Integer> {
    List<CountCommentUser> findCountCommentUserByUserIdIn(List<Integer> userIds);

    CountCommentUser findCountCommentUserByUserId(int userId);
}
