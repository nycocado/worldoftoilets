package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.DatabaseSaveException;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.entities.*;
import pt.iade.ei.thinktoilet.models.requests.ReportRequest;
import pt.iade.ei.thinktoilet.models.response.ApiResponse;
import pt.iade.ei.thinktoilet.repositories.ReportRepository;
import pt.iade.ei.thinktoilet.repositories.TypeReportRepository;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private ToiletService toiletService;
    @Autowired
    private UserService userService;
    @Autowired
    private InteractionService interactionService;
    @Autowired
    private TypeReportRepository typeReportRepository;

    public Report getReportByInteractionId(int interactionId) {
        return Optional.ofNullable(reportRepository.findReportByInteraction_Id(interactionId))
                .orElseThrow(() -> new NotFoundException(String.valueOf(interactionId), "Report", "id"));
    }

    public TypeReport getTypeReportByTechnicalName(String technicalName) {
        return Optional.ofNullable(typeReportRepository.findTypeReportByTechnicalName(technicalName))
                .orElseThrow(() -> new NotFoundException(technicalName, "TypeReport", "technical name"));
    }

    public Report saveReport(Report report) {
        return Optional.of(reportRepository.save(report))
                .orElseThrow(() -> new DatabaseSaveException("Report"));
    }

    public void deleteReport(Report report) {
        reportRepository.delete(report);
    }

    @Transactional
    public ResponseEntity<ApiResponse> addReport(ReportRequest request) {
        Toilet toilet = toiletService.getToiletById(request.getToiletId());
        User user = userService.getUserById(request.getUserId());
        Interaction interaction = interactionService.getInteractionByToiletAndUser(toilet, user);
        TypeReport typeReport = getTypeReportByTechnicalName(request.getTypeReport());

        Report report = Optional.ofNullable(reportRepository.findReportByInteraction_Id(interaction.getId()))
                .orElseGet(() -> {
                    Report newReport = new Report();
                    newReport.setInteraction(interaction);
                    return newReport;
                });

        report.setTypeReport(typeReport);
        report.setCreationDate(LocalDate.now());

        saveReport(report);

        ApiResponse response = new ApiResponse(HttpStatus.CREATED.value(), "Report added successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<ApiResponse> removeReport(int toiletId, int userId) {
        if (!toiletService.existsToiletById(toiletId)) {
            throw new NotFoundException(String.valueOf(toiletId), "Toilet", "id");
        }
        if (!userService.existsUserById(userId)) {
            throw new NotFoundException(String.valueOf(userId), "User", "id");
        }
        Interaction interaction = interactionService.getInteractionByToiletIdAndUserId(toiletId, userId);
        Report report = getReportByInteractionId(interaction.getId());

        deleteReport(report);

        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Report removed successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
