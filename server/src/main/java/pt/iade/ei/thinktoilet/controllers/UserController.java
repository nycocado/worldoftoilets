package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
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
    public List<UserDTO> getUsers(
            @RequestParam(required = false) List<Integer> ids
    ) {
        logger.info("Sending all users");
        if (ids != null)
            return userService.findUsersByIds(ids);
        else
            return userService.findAllUsers();
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO getUser(
            @PathVariable int id
    ) {
        logger.info("Sending user with id {}", id);
        return userService.findUserById(id);
    }

    @GetMapping(path = "/{id}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<CommentDTO> getUserComments(
            @PathVariable int id,
            @RequestParam(defaultValue = "false", required = false) boolean pageable,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "20", required = false) int size
    ) {
        logger.info("Sending comments from user with id {}", id);
        if (pageable)
            return commentService.findCommentsByUserIdPaging(id, page, size).getContent();
        else
            return commentService.findCommentsByUserId(id);
    }
}
