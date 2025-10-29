package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import pt.iade.ei.thinktoilet.models.entities.TypeReport;

public interface TypeReportRepository extends CrudRepository<TypeReport, Integer> {
    TypeReport findTypeReportByTechnicalName(String technicalName);
}
