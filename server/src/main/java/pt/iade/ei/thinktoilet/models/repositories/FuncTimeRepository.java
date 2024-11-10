package pt.iade.ei.thinktoilet.models.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.FuncTime;

@Repository
public interface FuncTimeRepository extends CrudRepository<FuncTime, Integer> {

}
