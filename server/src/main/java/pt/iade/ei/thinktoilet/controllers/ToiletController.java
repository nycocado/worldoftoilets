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
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.dtos.CommentRequest;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
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
            @RequestParam(required = false) List<Integer> ids,
            @RequestParam(required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending all toilets");
        if (ids != null)
            return toiletService.findToiletsByIds(ids);
        else if (pageable)
            return toiletService.findAllToiletsPaging(page, size).getContent();
        else
            return toiletService.findAllToilets();
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
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending toilets nearby");
        if (pageable)
            return toiletService.findToiletsNearbyPaging(lat, lon, page, size).getContent();
        else
            return toiletService.findToiletsNearby(lat, lon);
    }

    @GetMapping(path = "/{id}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<CommentDTO> getToiletComments(
            @PathVariable int id,
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending comments from toilet with id {}", id);
        if (pageable)
            return commentService.findCommentsByToiletIdPaging(id, page, size).getContent();
        else
            return commentService.findCommentsByToiletId(id);
    }

    @GetMapping(path = "/users/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ToiletDTO> getToiletByUserId(
            @PathVariable int id
    ) {
        logger.info("Sending toilet ids from user with id {}", id);
        return toiletService.findToiletsByUserId(id);
    }

    @PostMapping(path = "/comments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public CommentDTO addComment(
            @RequestBody CommentRequest commentRequest
    ) {
        logger.info("Adding comment to toilet with id {} and user with id {}", commentRequest.getToiletId(), commentRequest.getUserId());
        return commentService.addComment(commentRequest);
    }

    @PostMapping(path = "{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadImage(
            @PathVariable int id,
            @RequestParam(required = true, name = "image") MultipartFile image
    ) {
        logger.info("Uploading image to toilet with id {}", id);
        toiletService.uploadImage(id, image);
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
