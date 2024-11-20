package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import pt.iade.ei.thinktoilet.models.views.CommentReaction;
import pt.iade.ei.thinktoilet.repositories.CommentReactionRepository;
import pt.iade.ei.thinktoilet.repositories.CommentRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private CommentReactionRepository commentReactionRepository;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<CommentDTO> getCommentsByToiletId(int toiletId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentRepository.findCommentsByInteractionToiletId(toiletId, pageable);
        return getCommentDTOS(comments);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<CommentDTO> getCommentsByUserId(int userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentRepository.findCommentsByInteractionUserId(userId, pageable);
        return getCommentDTOS(comments);
    }

    private Page<CommentDTO> getCommentDTOS(Page<Comment> comments) {
        List<CommentReaction> numLikes = commentReactionRepository.findCommentReactionsByCommentIdIn(comments.map(Comment::getId).toList());

        Map<Integer, CommentReaction> commentReactionMap = numLikes.stream().collect(Collectors.toMap(CommentReaction::getCommentId, CommentReaction -> CommentReaction));

        return comments.map(comment -> {
            int likes = commentReactionMap.getOrDefault(comment.getId(), new CommentReaction()).getLikes();
            int dislikes = commentReactionMap.getOrDefault(comment.getId(), new CommentReaction()).getDislikes();
            return new CommentDTO(
                    comment.getId(),
                    comment.getInteraction().getToilet().getId(),
                    comment.getInteraction().getUser().getId(),
                    comment.getText(),
                    comment.getRatingClean(),
                    comment.isRatingPaper(),
                    comment.getRatingStructure(),
                    comment.getRatingAccessibility(),
                    comment.getCreationDateTime(),
                    likes,
                    dislikes,
                    comment.getScore()
            );
        });
    }
}
