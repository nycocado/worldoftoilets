package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import pt.iade.ei.thinktoilet.models.views.Dislikes;
import pt.iade.ei.thinktoilet.models.views.Likes;
import pt.iade.ei.thinktoilet.repositories.CommentRepository;
import pt.iade.ei.thinktoilet.repositories.DislikesRepository;
import pt.iade.ei.thinktoilet.repositories.LikesRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private LikesRepository likesRepository;
    @Autowired
    private DislikesRepository dislikesRepository;

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
        List<Likes> numLikes = likesRepository.findLikesByCommentIdIn(comments.stream().map(Comment::getId).toList());
        List<Dislikes> numDislikes = dislikesRepository.findDislikesByCommentIdIn(comments.stream().map(Comment::getId).toList());

        Map<Integer, Integer> likesMap = numLikes.stream().collect(Collectors.toMap(Likes::getCommentId, Likes::getLikes));
        Map<Integer, Integer> dislikesMap = numDislikes.stream().collect(Collectors.toMap(Dislikes::getCommentId, Dislikes::getDislikes));

        return comments.map(comment -> {
            int likes = likesMap.getOrDefault(comment.getId(), 0);
            int dislikes = dislikesMap.getOrDefault(comment.getId(), 0);
            return new CommentDTO(comment, likes, dislikes);
        });
    }
}
