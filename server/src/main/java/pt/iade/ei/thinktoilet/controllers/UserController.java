package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.services.CommentService;
import pt.iade.ei.thinktoilet.services.UserService;

import java.util.List;

@RestController
@RequestMapping(path = "/api/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;
    @Autowired
    private CommentService commentService;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<UserDTO> getUsers(@RequestParam(required = false) List<Integer> ids) {
        logger.info("Sending all users");
        if (ids == null)
            return userService.getAllUsers();
        else
            return userService.getUsersByIds(ids);
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO getUser(@PathVariable int id) {
        logger.info("Sending user with id {}", id);
        return userService.getUser(id);
    }

    @GetMapping(path = "/{id}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<CommentDTO> getUserComments(@PathVariable int id) {
        logger.info("Sending comments from user with id {}", id);
        List<CommentDTO> comments = commentService.getCommentsByUserId(id);
        if (comments == null) {
            throw new NotFoundException(String.valueOf(id), "User", "id");
        } else {
            return comments;
        }
    }

    @GetMapping(path = "/{id}/comments/page", produces = MediaType.APPLICATION_JSON_VALUE)
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
