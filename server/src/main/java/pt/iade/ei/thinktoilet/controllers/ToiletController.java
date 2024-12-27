package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
import pt.iade.ei.thinktoilet.models.requests.ReportRequest;
import pt.iade.ei.thinktoilet.models.response.ApiResponse;
import pt.iade.ei.thinktoilet.models.views.SearchToilet;
import pt.iade.ei.thinktoilet.services.ReportService;
import pt.iade.ei.thinktoilet.services.ToiletService;

import java.util.List;

@RestController
@RequestMapping(path = "/api/toilets")
public class ToiletController {
    private final Logger logger = LoggerFactory.getLogger(ToiletController.class);
    @Autowired
    private ToiletService toiletService;
    @Autowired
    private ReportService reportService;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ToiletDTO> getToilets(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) List<Integer> ids,
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        if (ids != null) {
            logger.info("Sending toilets with ids {}", ids);
            return toiletService.findToiletsByIds(ids);
        }

        logger.info("Sending toilets with state {} and user id {}", state, userId);
        if (pageable)
            return toiletService.findToilets(state, userId, page, size);
        return toiletService.findToilets(state, userId);
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ToiletDTO getToiletById(
            @PathVariable int id
    ) {
        logger.info("Sending toilet with id {}", id);
        return toiletService.findToiletById(id);
    }

    @GetMapping(path = "/nearby", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ToiletDTO> getToiletsNearby(
            @RequestParam double lon,
            @RequestParam double lat,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Integer userId,
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending toilets nearby with state {} and user id {}", state, userId);
        if (pageable)
            return toiletService.findToiletsNearby(state, lat, lon, userId, page, size);
        return toiletService.findToiletsNearby(state, lat, lon, userId);
    }

    @GetMapping(path = "/users/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ToiletDTO> getToiletByUserId(
            @PathVariable int userId,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending toilet ids from user with id {}", userId);
        if (pageable)
            return toiletService.findToiletsByUserId(state, userId, page, size);
        return toiletService.findToiletsByUserId(state, userId);
    }

    @PostMapping(path = "/reports", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> addReport(
            @RequestBody ReportRequest request
    ) {
        logger.info("Adding report to toilet with id {} and user with id {}", request.getToiletId(), request.getUserId());
        return reportService.addReport(request);
    }

    @DeleteMapping(path = "/reports", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> deleteReport(
            @RequestParam int toiletId,
            @RequestParam int userId
    ) {
        logger.info("Deleting report from toilet with id {} and user with id {}", toiletId, userId);
        return reportService.deleteReport(toiletId, userId);
    }

    @GetMapping(path = "/search/{query}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<SearchToilet> searchToilets(
            @PathVariable String query,
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Searching toilets with query {}", query);
        if (pageable)
            return toiletService.searchToilets(query, page, size);
        return toiletService.searchToilets(query);
    }

    @PostMapping(path = "{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> uploadImage(
            @PathVariable int id,
            @RequestParam(name = "image") MultipartFile image
    ) {
        logger.info("Uploading image to toilet with id {}", id);
        return toiletService.uploadImage(id, image);
    }

    @GetMapping(path = "/{id}/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<Resource> getImage(@PathVariable int id) {
        logger.info("Sending image from toilet with id {}", id);
        try {
            Resource image = toiletService.getImage(id);
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(image);
        } catch (Exception e) {
            throw new NotFoundException(String.valueOf(id), "Toilet", "id");
        }
    }
}
