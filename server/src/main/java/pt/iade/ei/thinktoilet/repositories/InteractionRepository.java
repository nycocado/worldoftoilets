package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Interaction;

@Repository
public interface InteractionRepository extends CrudRepository<Interaction, Integer> {
    Interaction findInteractionByToiletIdAndUserId(int toiletId, int userId);
}
