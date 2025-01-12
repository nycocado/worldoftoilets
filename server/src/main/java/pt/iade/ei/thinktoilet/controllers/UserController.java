package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.models.response.ApiResponse;
import pt.iade.ei.thinktoilet.services.UserService;

import java.util.List;

@RestController
@RequestMapping(path = "/api/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<UserDTO> getUsers(
            @RequestParam(required = false) List<Integer> ids
    ) {
        logger.info("Sending all users");
        if (ids != null)
            return userService.findUsersByIds(ids);
        return userService.findAllUsers();
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO getUser(
            @PathVariable int id
    ) {
        logger.info("Sending user with id {}", id);
        return userService.findUserById(id);
    }

    @PostMapping(path = "/{id}/edit/name", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO editName(
            @PathVariable int id,
            @RequestParam String name,
            @RequestParam String password
    ) {
        logger.info("Editing name of user with id {}", id);
        return userService.editName(id, name, password);
    }

    @PostMapping(path = "/{id}/edit/email", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO editEmail(
            @PathVariable int id,
            @RequestParam String email,
            @RequestParam String password
    ) {
        logger.info("Editing email of user with id {}", id);
        return userService.editEmail(id, email, password);
    }

    @PostMapping(path = "/{id}/edit/password", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO editPassword(
            @PathVariable int id,
            @RequestParam String newPassword,
            @RequestParam String password
    ) {
        logger.info("Editing password of user with id {}", id);
        return userService.editPassword(id, newPassword, password);
    }

    @PostMapping(path = "/{id}/edit/icon", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO editIcon(
            @PathVariable int id,
            @RequestParam String iconId
    ) {
        logger.info("Editing icon of user with id {}", id);
        return userService.editIcon(id, iconId);
    }

    @DeleteMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> deleteUser(
            @RequestParam int id
    ) {
        logger.info("Deleting user with id {}", id);
        return userService.removeUser(id);
    }
}
