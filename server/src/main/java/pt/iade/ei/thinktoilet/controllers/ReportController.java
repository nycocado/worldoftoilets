package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.iade.ei.thinktoilet.models.repositories.ReportRepository;

@RestController
@RequestMapping(path = "/api/reports")
public class ReportController {
    private Logger logger = LoggerFactory.getLogger(ReportController.class);
    @Autowired
    private ReportRepository reportRepository;

}
