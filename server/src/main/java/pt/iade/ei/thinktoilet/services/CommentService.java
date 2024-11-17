package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.dtos.NumObject;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import pt.iade.ei.thinktoilet.repositories.CommentRepository;
import pt.iade.ei.thinktoilet.repositories.ReactionRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ReactionRepository reactionRepository;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<CommentDTO> getCommentsByToiletId(int toiletId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentRepository.findCommentsByToiletId(toiletId, pageable);
        return getCommentDTOS(comments);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<CommentDTO> getCommentsByUserId(int userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentRepository.findCommentsByUserId(userId, pageable);
        return getCommentDTOS(comments);
    }

    private Page<CommentDTO> getCommentDTOS(Page<Comment> comments) {
        List<NumObject> numLikes = reactionRepository.countLikesByCommentsIds(comments.stream().map(Comment::getId).toList());
        List<NumObject> numDislikes = reactionRepository.countDislikesByCommentsIds(comments.stream().map(Comment::getId).toList());

        Map<Integer, Integer> likesMap = numLikes.stream().collect(Collectors.toMap(NumObject::getId, NumObject::getNum));
        Map<Integer, Integer> dislikesMap = numDislikes.stream().collect(Collectors.toMap(NumObject::getId, NumObject::getNum));

        return comments.map(comment -> {
            int likes = likesMap.getOrDefault(comment.getId(), 0);
            int dislikes = dislikesMap.getOrDefault(comment.getId(), 0);
            return new CommentDTO(comment, likes, dislikes);
        });
    }
}
