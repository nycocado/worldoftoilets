package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.State;

@Repository
public interface StateRepository extends CrudRepository<State, Integer> {
    State findStateByTechnicalName(String technicalName);

    boolean existsStateByTechnicalName(String technicalName);
}
