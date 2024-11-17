package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Extra;
import java.util.List;

@Repository
public interface ExtraRepository extends CrudRepository<Extra, Integer> {
    @EntityGraph(attributePaths = {"typeExtra"})
    @Query("SELECT e " +
            "FROM Extra e " +
            "WHERE e.toilet.id IN :toiletIds")
    List<Extra> findExtrasByToiletIds(List<Integer> toiletIds);

    @EntityGraph(attributePaths = {"typeExtra"})
    @Query("SELECT e " +
            "FROM Extra e " +
            "WHERE e.toilet.id = :toiletId")
    List<Extra> findExtrasByToiletId(int toiletId);
}
