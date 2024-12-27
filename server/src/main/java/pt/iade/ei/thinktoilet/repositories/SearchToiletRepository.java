package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pt.iade.ei.thinktoilet.models.views.SearchToilet;

import java.util.List;

public interface SearchToiletRepository extends JpaRepository<SearchToilet, Integer> {
    @Query(
            value = "SELECT t.toil_id, t.toil_name, t.toil_address " +
                    "FROM vw_search_toilet vst " +
                    "INNER JOIN toilet t ON vst.toil_id = t.toil_id " +
                    "WHERE MATCH(t.toil_name, t.toil_address) AGAINST(:query IN NATURAL LANGUAGE MODE) AND t.toil_state_id = 1",
            nativeQuery = true
    )
    List<SearchToilet> searchToilets(String query);

    @Query(
            value = "SELECT t.toil_id, t.toil_name, t.toil_address " +
                    "FROM vw_search_toilet vst " +
                    "INNER JOIN toilet t ON vst.toil_id = t.toil_id " +
                    "WHERE MATCH(t.toil_name, t.toil_address) AGAINST(:query IN NATURAL LANGUAGE MODE) AND t.toil_state_id = 1",
            nativeQuery = true
    )
    List<SearchToilet> searchToilets(String query, Pageable pageable);
}
