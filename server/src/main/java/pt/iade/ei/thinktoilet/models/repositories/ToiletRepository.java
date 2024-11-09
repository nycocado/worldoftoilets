package pt.iade.ei.thinktoilet.models.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.Toilet;

@Repository
public interface ToiletRepository extends CrudRepository<Toilet, Integer> {

}
