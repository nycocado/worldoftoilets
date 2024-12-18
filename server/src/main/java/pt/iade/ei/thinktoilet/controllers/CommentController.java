package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.dtos.ReactionDTO;
import pt.iade.ei.thinktoilet.models.requests.CommentRequest;
import pt.iade.ei.thinktoilet.models.requests.ReactionRequest;
import pt.iade.ei.thinktoilet.models.response.ApiResponse;
import pt.iade.ei.thinktoilet.services.CommentService;
import pt.iade.ei.thinktoilet.services.ReactionService;

import java.util.List;

@RestController
@RequestMapping(path = "/api/comments")
public class CommentController {
    private final Logger logger = LoggerFactory.getLogger(CommentController.class);
    @Autowired
    private CommentService commentService;
    @Autowired
    private ReactionService reactionService;

    @GetMapping(path = "/toilets/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<CommentDTO> getCommentsByToiletId(
            @PathVariable int id,
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending comments for toilet with id {}", id);
        if (pageable)
            return commentService.findCommentsByToiletIdPaging(id, page, size).getContent();
        else
            return commentService.findCommentsByToiletId(id);
    }

    @GetMapping(path = "/users/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<CommentDTO> getCommentsByUserId(
            @PathVariable int id,
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending comments for user with id {}", id);
        if (pageable)
            return commentService.findCommentsByUserIdPaging(id, page, size).getContent();
        else
            return commentService.findCommentsByUserId(id);
    }

    @GetMapping(path = "/reactions", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ReactionDTO> getReactionsByUserId(
            @RequestParam int userId,
            @RequestParam List<Integer> commentIds
    ) {
        logger.info("Sending comments with reaction for user with id {}", userId);
        return reactionService.findReactionsByUserId(userId, commentIds);
    }

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public CommentDTO addComment(
            @RequestBody CommentRequest request
    ) {
        logger.info("Adding comment to toilet with id {} and user with id {}", request.getToiletId(), request.getUserId());
        return commentService.addComment(request);
    }

    @PostMapping(path = "/reactions", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> addReaction(
            @RequestBody ReactionRequest request
    ) {
        logger.info("Adding reaction to comment with id {} and user with id {}", request.getCommentId(), request.getUserId());
        return reactionService.addReaction(request);
    }

    @DeleteMapping(path = "/reactions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> deleteReaction(
            @RequestParam int commentId,
            @RequestParam int userId
    ) {
        logger.info("Deleting reaction from comment with id {} and user with id {}", commentId, userId);
        return reactionService.deleteReaction(commentId, userId);
    }
}
