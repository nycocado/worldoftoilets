package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.DatabaseSaveException;
import pt.iade.ei.thinktoilet.exceptions.EmailAlreadyInUseException;
import pt.iade.ei.thinktoilet.exceptions.EmailNotFoundException;
import pt.iade.ei.thinktoilet.exceptions.InvalidPasswordException;
import pt.iade.ei.thinktoilet.models.dtos.LoginRequest;
import pt.iade.ei.thinktoilet.models.dtos.RegisterRequest;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.repositories.CountCommentUserRepository;
import pt.iade.ei.thinktoilet.repositories.UserRepository;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CountCommentUserRepository countCommentUserRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO login(LoginRequest request) {
        User user = Optional.ofNullable(userRepository.findUserByEmail(request.getEmail()))
                .orElseThrow(() -> new EmailNotFoundException(request.getEmail()));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new InvalidPasswordException();
        }

        int numComments = countCommentUserRepository.findCountCommentUserByUserId(user.getId()).getNum();

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getPoints(),
                user.getIconId(),
                numComments
        );
    }

    @Transactional
    public UserDTO register(RegisterRequest request){
        if(userRepository.findUserByEmail(request.getEmail()) != null){
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

        User savedUser = Optional.of(userRepository.save(user))
                .orElseThrow(() -> new DatabaseSaveException("User"));

        return new UserDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getPoints(),
                savedUser.getIconId(),
                0
        );
    }
}
