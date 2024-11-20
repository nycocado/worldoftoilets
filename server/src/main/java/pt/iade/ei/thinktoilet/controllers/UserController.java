package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
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
        logger.info("Sending all users without sensitive data");
        return userRepository.findUsersByOrderById();
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public User getUser(@PathVariable int id) {
        logger.info("Sending user with id {} without sensitive data", id);
        return userRepository.findUserById(id);
    }

    @GetMapping(path = "/{id}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<CommentDTO> getUserComments(
            @PathVariable int id,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending comments for user with id {}", id);
        return commentService.getCommentsByUserId(id, page, size);
    }
}
