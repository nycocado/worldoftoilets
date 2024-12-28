package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Toilet;

import java.util.Collection;
import java.util.List;

@Repository
public interface ToiletRepository extends JpaRepository<Toilet, Integer> {
    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "ORDER BY t.id")
    List<Toilet> findToilets();

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "ORDER BY t.id")
    List<Toilet> findToilets(Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "LEFT JOIN UserReportToilet urt ON t.id = urt.toiletId AND urt.userId = :userId " +
            "WHERE urt.userId IS NULL " +
            "ORDER BY t.id")
    List<Toilet> findToiletsForUserId(int userId);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "LEFT JOIN UserReportToilet urt ON t.id = urt.toiletId AND urt.userId = :userId " +
            "WHERE urt.userId IS NULL " +
            "ORDER BY t.id")
    List<Toilet> findToiletsForUserId(int userId, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "WHERE t.state.technicalName = :stateTechnicalName " +
            "ORDER BY t.id")
    List<Toilet> findToiletsByStateTechnicalName(String stateTechnicalName);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "WHERE t.state.technicalName = :stateTechnicalName " +
            "ORDER BY t.id")
    List<Toilet> findToiletsByStateTechnicalName(String stateTechnicalName, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "LEFT JOIN UserReportToilet urt ON t.id = urt.toiletId AND urt.userId = :userId " +
            "WHERE t.state.technicalName = :stateTechnicalName AND urt.userId IS NULL " +
            "ORDER BY t.id")
    List<Toilet> findToiletsByStateTechnicalNameAndForUserId(String stateTechnicalName, int userId);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "LEFT JOIN UserReportToilet urt ON t.id = urt.toiletId AND urt.userId = :userId " +
            "WHERE t.state.technicalName = :stateTechnicalName AND urt.userId IS NULL " +
            "ORDER BY t.id")
    List<Toilet> findToiletsByStateTechnicalNameAndForUserId(String stateTechnicalName, int userId, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    Toilet findToiletById(int id);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "WHERE t.id IN :ids")
    List<Toilet> findToiletsByIds(Collection<Integer> ids);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findToiletsByDistance(double lat, double lon);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findToiletsByDistance(double lat, double lon, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "LEFT JOIN UserReportToilet urt ON t.id = urt.toiletId AND urt.userId = :userId " +
            "WHERE urt.userId IS NULL " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findToiletsByDistanceAndForUserId(double lat, double lon, int userId);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "LEFT JOIN UserReportToilet urt ON t.id = urt.toiletId AND urt.userId = :userId " +
            "WHERE urt.userId IS NULL " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findToiletsByDistanceAndForUserId(double lat, double lon, int userId, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "WHERE t.state.technicalName = :stateTechnicalName " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findToiletsByDistanceAndState(String stateTechnicalName, double lat, double lon);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "WHERE t.state.technicalName = :stateTechnicalName " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findToiletsByDistanceAndState(String stateTechnicalName, double lat, double lon, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "LEFT JOIN UserReportToilet urt ON t.id = urt.toiletId AND urt.userId = :userId " +
            "WHERE t.state.technicalName = :stateTechnicalName AND urt.userId IS NULL " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findToiletsByDistanceAndStateAndForUserId(String stateTechnicalName, double lat, double lon, int userId);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "LEFT JOIN UserReportToilet urt ON t.id = urt.toiletId AND urt.userId = :userId " +
            "WHERE t.state.technicalName = :stateTechnicalName AND urt.userId IS NULL " +
            "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))")
    List<Toilet> findToiletsByDistanceAndStateAndForUserId(String stateTechnicalName, double lat, double lon, int userId, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT i.toilet " +
            "FROM Interaction i " +
            "WHERE i.user.id = :userId")
    List<Toilet> findToiletsByUserId(int userId);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT i.toilet " +
            "FROM Interaction i " +
            "WHERE i.user.id = :userId")
    List<Toilet> findToiletsByUserId(int userId, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT i.toilet " +
            "FROM Interaction i " +
            "WHERE i.toilet.state.technicalName = :stateTechnicalName AND i.user.id = :userId")
    List<Toilet> findToiletsByUserIdAndState(String stateTechnicalName, int userId);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT i.toilet " +
            "FROM Interaction i " +
            "WHERE i.toilet.state.technicalName = :stateTechnicalName AND i.user.id = :userId")
    List<Toilet> findToiletsByUserIdAndState(String stateTechnicalName, int userId, Pageable pageable);

    @EntityGraph(attributePaths = {"city", "city.country", "access", "state"})
    @Query("SELECT t " +
            "FROM Toilet t " +
            "WHERE t.latitude >= :minLat AND t.latitude <= :maxLat AND t.longitude >= :minLon AND t.longitude <= :maxLon AND t.state.technicalName = 'active'")
    List<Toilet> findToiletsByBoundingBox(double minLat, double maxLat, double minLon, double maxLon);

    boolean existsToiletById(int id);
}
