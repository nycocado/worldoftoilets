package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import pt.iade.ei.thinktoilet.models.views.CommentReaction;
import pt.iade.ei.thinktoilet.repositories.CommentPagingRepository;
import pt.iade.ei.thinktoilet.repositories.CommentReactionRepository;
import pt.iade.ei.thinktoilet.repositories.CommentRepository;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private CommentPagingRepository commentPagingRepository;
    @Autowired
    private CommentReactionRepository commentReactionRepository;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public List<CommentDTO> getCommentsByToiletId(int toiletId) {
        List<Comment> comments = commentRepository.findCommentsByInteractionToiletId(toiletId);
        if(comments.isEmpty()) {
            throw new NotFoundException(String.valueOf(toiletId), "Comment", "toilet id");
        }
        return mapCommentDTOS(comments);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<CommentDTO> getCommentsByToiletIdPaging(int toiletId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentPagingRepository.findCommentsByInteractionToiletId(toiletId, pageable);
        if(comments.isEmpty()) {
            throw new NotFoundException(String.valueOf(toiletId), "Comment", "toilet id");
        }
        List<Comment> commentsList = comments.toList();

        return new PageImpl<>(mapCommentDTOS(commentsList), pageable, comments.getTotalElements());
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public List<CommentDTO> getCommentsByUserId(int userId) {
        List<Comment> comments = commentRepository.findCommentsByInteractionUserId(userId);
        if(comments.isEmpty()) {
            throw new NotFoundException(String.valueOf(userId), "Comment", "user id");
        }
        return mapCommentDTOS(comments);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Page<CommentDTO> getCommentsByUserIdPaging(int userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentPagingRepository.findCommentsByInteractionUserId(userId, pageable);
        if(comments.isEmpty()) {
            throw new NotFoundException(String.valueOf(userId), "Comment", "user id");
        }
        List<Comment> commentsList = comments.toList();

        return new PageImpl<>(mapCommentDTOS(commentsList), pageable, comments.getTotalElements());
    }

    private <T> List<CommentDTO> mapCommentDTOS(Collection<Comment> comments) {
        List<Integer> commentIds = comments.stream().map(Comment::getId).toList();
        List<CommentReaction> numLikes = commentReactionRepository.findCommentReactionsByCommentIdIn(commentIds);

        // Mapear reações de comentários
        Map<Integer, CommentReaction> commentReactionMap = numLikes.stream()
                .collect(Collectors.toMap(CommentReaction::getCommentId, reaction -> reaction));

        // Mapear comentários para DTOs
        return comments.stream().map(comment -> {
            CommentReaction reaction = commentReactionMap.getOrDefault(comment.getId(), new CommentReaction());
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
                    reaction.getLikes(),
                    reaction.getDislikes(),
                    comment.getScore()
            );
        }).toList();
    }
}
