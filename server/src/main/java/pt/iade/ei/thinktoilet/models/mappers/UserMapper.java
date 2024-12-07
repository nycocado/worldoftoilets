package pt.iade.ei.thinktoilet.models.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pt.iade.ei.thinktoilet.models.dtos.UserDTO;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.models.views.CountCommentUser;
import pt.iade.ei.thinktoilet.repositories.CountCommentUserRepository;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UserMapper {
    @Autowired
    private CountCommentUserRepository countCommentUserRepository;

    public UserDTO mapUserDTO(User user) {
        CountCommentUser countComment = Optional.ofNullable(countCommentUserRepository.findCountCommentUserByUserId(user.getId()))
                .orElse(new CountCommentUser(user.getId(), 0));
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getPoints(),
                user.getIconId(),
                countComment.getNum()
        );
    }

    public List<UserDTO> mapUserDTOS(Collection<User> users) {
        List<Integer> userIds = users.stream().map(User::getId).toList();
        List<CountCommentUser> countCommentUsers = countCommentUserRepository.findCountCommentUserByUserIdIn(userIds);

        Map<Integer, Integer> countCommentUserMap = countCommentUsers.stream()
                .collect(Collectors.toMap(CountCommentUser::getUserId, CountCommentUser::getNum));

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
