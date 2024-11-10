package pt.iade.ei.thinktoilet.models.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.entities.Report;

@Repository
public interface ReportRepository extends CrudRepository<Report, Integer> {

}
