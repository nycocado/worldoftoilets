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
import java.util.stream.Collectors;

@Component
public class UserMapper {
    @Autowired
    private CountCommentUserRepository countCommentUserRepository;

    public UserDTO mapLoginResponse(User user, String email) {
        CountCommentUser countComment = countCommentUserRepository.findCountCommentUserByUserId(user.getId());
        return new UserDTO(
                user.getId(),
                user.getName(),
                email,
                user.getPoints(),
                user.getIconId(),
                countComment.getNum()
        );
    }

    public UserDTO mapUserDTO(User user) {
        CountCommentUser countComment = countCommentUserRepository.findCountCommentUserByUserId(user.getId());
        return new UserDTO(
                user.getId(),
                user.getName(),
                null,
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
            int numComments = countCommentUserMap.get(user.getId());
            return new UserDTO(
                    user.getId(),
                    user.getName(),
                    null,
                    user.getPoints(),
                    user.getIconId(),
                    numComments
            );
        }).toList();
    }
}
