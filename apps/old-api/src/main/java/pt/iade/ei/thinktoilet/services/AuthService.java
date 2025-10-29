package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.EmailAlreadyInUseException;
import pt.iade.ei.thinktoilet.exceptions.InvalidPasswordException;
import pt.iade.ei.thinktoilet.models.requests.LoginRequest;
import pt.iade.ei.thinktoilet.models.requests.RegisterRequest;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.models.mappers.UserMapper;
import pt.iade.ei.thinktoilet.models.response.ApiResponse;

@Service
public class AuthService {
    @Autowired
    private UserService userService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO login(LoginRequest request) {
        User user = userService.getUserByEmail(request.getEmail());

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new InvalidPasswordException();
        }

        return userMapper.mapLoginResponse(user, request.getEmail());
    }

    @Transactional
    public ResponseEntity<ApiResponse> register(RegisterRequest request){
        if(userService.existsUserByEmail(request.getEmail())){
            throw new EmailAlreadyInUseException();
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPoints(0);
        user.setIconId(request.getIconId());
        user.setBirthDate(request.getBirthDate());
        user.setCreationDate(java.time.LocalDate.now());

        userService.saveUser(user);

        ApiResponse response = new ApiResponse(HttpStatus.CREATED.value(), "User registered successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
