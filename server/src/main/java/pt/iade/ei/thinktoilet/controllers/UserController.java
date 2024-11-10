package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import pt.iade.ei.thinktoilet.models.repositories.UserRepository;
import pt.iade.ei.thinktoilet.models.entities.User;

@RestController
@RequestMapping(path = "/api/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserRepository userRepository;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<User> getUsers() {
        logger.info("Sending all users without sensitive data");
        return userRepository.findAllWithoutSensitiveData();
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<User> getUser(@PathVariable int id) {
        logger.info("Sending user with id {} without sensitive data", id);
        return userRepository.findByIdWithoutSensitiveData(id);
    }

    @GetMapping(path = "/name/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<User> getUser(@PathVariable String name) {
        logger.info("Sending user with name {} without sensitive data", name);
        return userRepository.findByNameWithoutSensitiveData(name);
    }
}
