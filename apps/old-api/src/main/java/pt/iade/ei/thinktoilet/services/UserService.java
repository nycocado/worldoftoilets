package pt.iade.ei.thinktoilet.services;

import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.*;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.models.mappers.UserMapper;
import pt.iade.ei.thinktoilet.models.response.ApiResponse;
import pt.iade.ei.thinktoilet.repositories.UserRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getUsers() {
        return userRepository.findUsers();
    }

    public List<User> getUsersByIds(Collection<Integer> ids) {
        return userRepository.findUserByIdIn(ids);
    }

    public User getUserById(int id) {
        return Optional.ofNullable(userRepository.findUserById(id))
                .orElseThrow(() -> new NotFoundException(String.valueOf(id), "User", "id"));
    }

    public User getUserByEmail(String email) {
        return Optional.ofNullable(userRepository.findUserByEmail(email))
                .orElseThrow(() -> new NotFoundException(email, "User", "email"));
    }

    public boolean existsUserById(int id) {
        return userRepository.existsUserById(id);
    }

    public boolean existsUserByEmail(String email) {
        return userRepository.existsUserByEmail(email);
    }

    public User saveUser(User user) {
        return Optional.of(userRepository.save(user))
                .orElseThrow(() -> new DatabaseSaveException("User"));
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    @Transactional
    public List<UserDTO> findAllUsers() {
        List<User> users = getUsers();
        return userMapper.mapUserDTOS(users);
    }

    @Transactional
    public List<UserDTO> findUsersByIds(Collection<Integer> ids) {
        List<User> users = getUsersByIds(ids);
        return userMapper.mapUserDTOS(users);
    }

    @Transactional
    public UserDTO findUserById(int id) {
        User user = getUserById(id);
        return userMapper.mapUserDTO(user);
    }

    @Transactional
    public UserDTO editName(int id, String name, String password) {
        User user = getUserById(id);
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException();
        }
        user.setName(name);
        User savedUser = saveUser(user);
        return userMapper.mapLoginResponse(savedUser, savedUser.getEmail());
    }

    @Transactional
    public UserDTO editEmail(int id, String email, String password) {
        User user = getUserById(id);
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException();
        }
        if (existsUserByEmail(email)) {
            throw new EmailAlreadyInUseException();
        }
        user.setEmail(email);
        User savedUser = saveUser(user);
        return userMapper.mapLoginResponse(savedUser, savedUser.getEmail());
    }

    @Transactional
    public UserDTO editPassword(int id, String newPassword, String password) {
        User user = getUserById(id);
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException();
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        User savedUser = saveUser(user);
        return userMapper.mapLoginResponse(savedUser, savedUser.getEmail());
    }

    @Transactional
    public UserDTO editIcon(int id, String iconId) {
        User user = getUserById(id);
        user.setIconId(iconId);
        User savedUser = saveUser(user);
        return userMapper.mapLoginResponse(savedUser, savedUser.getEmail());
    }

    @Transactional
    public ResponseEntity<ApiResponse> removeUser(int id) {
        User user = getUserById(id);

        deleteUser(user);

        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "User removed successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
