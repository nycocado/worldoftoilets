package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Toilet;

import java.util.Collection;
import java.util.List;

@Repository
public interface ToiletRepository extends PagingAndSortingRepository<Toilet, Integer> {
    @EntityGraph(attributePaths = {"city", "city.country", "access"})
    List<Toilet> findToiletsByOrderById();

    @EntityGraph(attributePaths = {"city", "city.country", "access"})
    Toilet findToiletById(int id);

    @EntityGraph(attributePaths = {"city", "city.country", "access"})
    List<Toilet> findToiletsByIdIn(Collection<Integer> ids);

    @EntityGraph(attributePaths = {"city", "city.country", "access"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findByDistance(double lat, double lon);

    @Query("SELECT i.toilet " +
            "FROM Interaction i " +
            "WHERE i.user.id = :userId")
    List<Toilet> findToiletsByUserId(int userId);
}
