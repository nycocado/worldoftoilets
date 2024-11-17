package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Toilet;

@Repository
public interface ToiletRepository extends PagingAndSortingRepository<Toilet, Integer> {
    @EntityGraph(attributePaths = {"city", "city.country", "access"})
    Page<Toilet> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access"})
    Toilet findToiletById(int id);

    @EntityGraph(attributePaths = {"city", "city.country", "access"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    Page<Toilet> findByDistance(double lat, double lon, Pageable pageable);
}
