package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.EmailAlreadyInUseException;
import pt.iade.ei.thinktoilet.exceptions.InvalidPasswordException;
import pt.iade.ei.thinktoilet.models.dtos.LoginRequest;
import pt.iade.ei.thinktoilet.models.dtos.RegisterRequest;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.models.mappers.UserMapper;

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

        return userMapper.mapUserDTO(user);
    }

    @Transactional
    public UserDTO register(RegisterRequest request){
        if(userService.existsUserByEmail(request.getEmail())){
            throw new EmailAlreadyInUseException("Email already in use.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPoints(0);
        user.setIconId(request.getIconId());
        user.setBirthDate(request.getBirthDate());
        user.setCreationDate(java.time.LocalDate.now());

        User savedUser = userService.saveUser(user);

        return userMapper.mapUserDTO(savedUser);
    }
}
