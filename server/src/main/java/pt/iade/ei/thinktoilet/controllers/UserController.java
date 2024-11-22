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
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.repositories.UserRepository;
import pt.iade.ei.thinktoilet.services.CommentService;

@RestController
@RequestMapping(path = "/api/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentService commentService;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<User> getUsers() {
        logger.info("Sending all users");
        return userRepository.findUsersByOrderById();
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public User getUser(@PathVariable int id) {
        logger.info("Sending user with id {}", id);
        User user = userRepository.findUserById(id);
        if (user == null) {
            throw new NotFoundException(String.valueOf(id), "User", "id");
        } else {
            return user;
        }

    }

    @GetMapping(path = "/{id}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<CommentDTO> getUserComments(@PathVariable int id) {
        logger.info("Sending comments from user with id {}", id);
        Iterable<CommentDTO> comments = commentService.getCommentsByUserId(id);
        if (comments == null) {
            throw new NotFoundException(String.valueOf(id), "User", "id");
        } else {
            return comments;
        }
    }

    @GetMapping(path = "/{id}/comments/paging", produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<CommentDTO> getUserCommentsPaging(
            @PathVariable int id,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending comments from user with id {} (page {})", id, page);
        Page<CommentDTO> comments = commentService.getCommentsByUserIdPaging(id, page, size);
        if (comments.isEmpty()) {
            throw new NotFoundException(String.valueOf(id), "User", "id");
        } else {
            return comments;
        }
    }
}
