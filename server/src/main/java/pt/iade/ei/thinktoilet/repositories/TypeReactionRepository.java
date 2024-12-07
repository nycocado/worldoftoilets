package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import pt.iade.ei.thinktoilet.models.entities.TypeReaction;

public interface TypeReactionRepository extends CrudRepository<TypeReaction, Integer> {
    TypeReaction findTypeReactionByName(String name);
}
