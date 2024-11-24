package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import pt.iade.ei.thinktoilet.exceptions.GlobalExceptionHandler;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.services.CommentService;
import pt.iade.ei.thinktoilet.services.ToiletService;

import java.util.List;

@RestController
@RequestMapping(path = "/api/toilets")
public class ToiletController {
    private final Logger logger = LoggerFactory.getLogger(ToiletController.class);
    @Autowired
    private ToiletService toiletService;
    @Autowired
    private CommentService commentService;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ToiletDTO> getToilets(
            @RequestParam(required = false) List<Integer> ids
    ) {
        logger.info("Sending all toilets");
        if (ids == null)
            return toiletService.getAllToilets();
        else
            return toiletService.getToiletsByIds(ids);
    }

    @GetMapping(path = "/page", produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<ToiletDTO> getToiletsPaging(
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending all toilets (page {})", page);
        return toiletService.getAllToiletsPaging(page, size);
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ToiletDTO getToilet(@PathVariable int id) {
        logger.info("Sending toilet with id {}", id);
        return toiletService.getToilet(id);
    }

    @GetMapping(path = "/nearby", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ToiletDTO> getToiletsNearby(
            @RequestParam(required = true) double lon,
            @RequestParam(required = true) double lat
    ) {
        logger.info("Sending toilets nearby");
        return toiletService.getToiletsNearby(lat, lon);
    }

    @GetMapping(path = "/nearby/page", produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<ToiletDTO> getToiletsNearbyPaging(
            @RequestParam(required = true) double lon,
            @RequestParam(required = true) double lat,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "10", required = false) int size
    ) {
        logger.info("Sending toilets nearby (page {})", page);
        return toiletService.getToiletsNearbyPaging(lat, lon, page, size);
    }

    @GetMapping(path = "/{id}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<CommentDTO> getToiletComments(@PathVariable int id) {
        logger.info("Sending comments from toilet with id {}", id);
        List<CommentDTO> comments = commentService.getCommentsByToiletId(id);
        if (comments == null) {
            throw new NotFoundException(String.valueOf(id), "Toilet", "id");
        } else {
            return comments;
        }
    }

    @GetMapping(path = "/{id}/comments/page", produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<CommentDTO> getToiletCommentsPaging(
            @PathVariable int id,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending comments from toilet with id {} (page {})", id, page);
        Page<CommentDTO> comments = commentService.getCommentsByToiletIdPaging(id, page, size);
        if (comments.isEmpty()) {
            throw new NotFoundException(String.valueOf(id), "Toilet", "id");
        } else {
            return comments;
        }
    }
}
