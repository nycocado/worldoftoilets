package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.User;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    Iterable<User> findUsersByOrderById();

    User findUserById(int id);
}
