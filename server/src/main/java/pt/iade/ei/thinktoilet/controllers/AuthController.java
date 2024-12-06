package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.iade.ei.thinktoilet.models.dtos.LoginRequest;
import pt.iade.ei.thinktoilet.models.dtos.RegisterRequest;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.services.AuthService;

@RestController
@RequestMapping(path = "/api/auth")
public class AuthController {
    private final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthService authService;

    @PostMapping(path = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO login(
            @RequestBody LoginRequest request
    ) {
        logger.info("Logging in user with email {}", request.getEmail());
        return authService.login(request);
    }

    @PostMapping(path = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO register(
            @RequestBody RegisterRequest request
    ) {
        logger.info("Registering user {}", request.getName());
        return authService.register(request);
    }
}
