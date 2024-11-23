package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.models.views.CountCommentUser;
import pt.iade.ei.thinktoilet.repositories.CountCommentUserRepository;
import pt.iade.ei.thinktoilet.repositories.UserRepository;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CountCommentUserRepository countCommentUserRepository;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findUsersByOrderById();
        return mapUserDTOS(users);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public UserDTO getUser(int id) {
        User user = Optional.ofNullable(userRepository.findUserById(id)).orElseThrow(() -> new NotFoundException(String.valueOf(id), "User", "id"));
        CountCommentUser countCommentUser = countCommentUserRepository.findCountCommentUserByUserId(id);
        int numComments = countCommentUser == null ? 0 : countCommentUser.getComments();
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getPoints(),
                user.getIconId(),
                numComments
        );
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public List<UserDTO> getUsersByIds(Collection<Integer> ids) {
        List<User> users = userRepository.findUserByIdIn(ids);
        return mapUserDTOS(users);
    }

    private <T> List<UserDTO> mapUserDTOS(Collection<User> users) {
        List<Integer> userIds = users.stream().map(User::getId).toList();
        List<CountCommentUser> countCommentUsers = countCommentUserRepository.findCountCommentUserByUserIdIn(userIds);

        Map<Integer, Integer> countCommentUserMap = countCommentUsers.stream()
                .collect(Collectors.toMap(CountCommentUser::getUserId, CountCommentUser::getComments));

        return users.stream().map(user -> {
            int numComments = countCommentUserMap.getOrDefault(user.getId(), 0);
            return new UserDTO(
                    user.getId(),
                    user.getName(),
                    user.getPoints(),
                    user.getIconId(),
                    numComments
            );
        }).toList();
    }
}
