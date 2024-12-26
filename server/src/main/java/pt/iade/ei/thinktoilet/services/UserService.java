package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.DatabaseSaveException;
import pt.iade.ei.thinktoilet.exceptions.EmailNotFoundException;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.models.mappers.UserMapper;
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

    public List<User> getUsers() {
        return Optional.ofNullable(userRepository.findUsers())
                .orElseThrow(() -> new NotFoundException("User", "User", "all"));
    }

    public List<User> getUsersByIds(Collection<Integer> ids) {
        return Optional.ofNullable(userRepository.findUserByIdIn(ids))
                .orElseThrow(() -> new NotFoundException("User", "User", "ids"));
    }

    public User getUserById(int id) {
        return Optional.ofNullable(userRepository.findUserById(id))
                .orElseThrow(() -> new NotFoundException(String.valueOf(id), "User", "id"));
    }

    public User getUserByEmail(String email) {
        return Optional.ofNullable(userRepository.findUserByEmail(email))
                .orElseThrow(() -> new EmailNotFoundException(email));
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
}
