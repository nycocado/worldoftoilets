package pt.iade.ei.thinktoilet.repositories;

import org.springframework.data.repository.CrudRepository;
import pt.iade.ei.thinktoilet.models.entities.Report;

public interface ReportRepository extends CrudRepository<Report, Integer>{
    Report findReportByInteraction_Id(int interactionId);
}