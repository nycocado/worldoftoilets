package pt.iade.ei.thinktoilet.models.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.iade.ei.thinktoilet.models.TypeReport;

@Repository
public interface TypeReportRepository extends CrudRepository<TypeReport, Integer> {

}
