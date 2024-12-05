package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.User;

import java.util.Collection;
import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    List<User> findUsersByOrderById();

    List<User> findUserByIdIn(Collection<Integer> ids);

    User findUserById(int id);

    User findUserByEmail(String email);
}
