package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.DatabaseSaveException;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.dtos.CommentRequest;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import pt.iade.ei.thinktoilet.models.entities.Interaction;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.models.views.CommentReaction;
import pt.iade.ei.thinktoilet.repositories.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private CommentPagingRepository commentPagingRepository;
    @Autowired
    private CommentReactionRepository commentReactionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ToiletRepository toiletRepository;
    @Autowired
    private InteractionRepository interactionRepository;
    @Autowired
    private InteractionService interactionService;

    @Transactional
    public List<CommentDTO> getCommentsByToiletId(int toiletId) {
        List<Comment> comments = Optional.ofNullable(commentRepository.findCommentsByInteractionToiletId(toiletId))
                .orElseThrow(() -> new NotFoundException(String.valueOf(toiletId), "Comment", "toilet id"));
        return mapCommentDTOS(comments);
    }

    @Transactional
    public Page<CommentDTO> getCommentsByToiletIdPaging(int toiletId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = Optional.ofNullable(commentPagingRepository.findCommentsByInteractionToiletId(toiletId, pageable))
                .orElseThrow(() -> new NotFoundException(String.valueOf(toiletId), "Comment", "toilet id"));
        return new PageImpl<>(mapCommentDTOS(comments.getContent()), pageable, comments.getTotalElements());
    }

    @Transactional
    public List<CommentDTO> getCommentsByUserId(int userId) {
        List<Comment> comments = Optional.ofNullable(commentRepository.findCommentsByInteractionUserId(userId))
                .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Comment", "user id"));
        return mapCommentDTOS(comments);
    }

    @Transactional
    public Page<CommentDTO> getCommentsByUserIdPaging(int userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = Optional.ofNullable(commentPagingRepository.findCommentsByInteractionUserId(userId, pageable))
                .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Comment", "user id"));
        return new PageImpl<>(mapCommentDTOS(comments.getContent()), pageable, comments.getTotalElements());
    }

    @Transactional
    public CommentDTO addComment(CommentRequest commentRequest) {
        User user = Optional.ofNullable(userRepository.findUserById(commentRequest.getUserId()))
                .orElseThrow(() -> new NotFoundException(String.valueOf(commentRequest.getUserId()), "User", "id"));
        Toilet toilet = Optional.ofNullable(toiletRepository.findToiletById(commentRequest.getToiletId()))
                .orElseThrow(() -> new NotFoundException(String.valueOf(commentRequest.getToiletId()), "Toilet", "id"));
        Interaction interaction = Optional.ofNullable(interactionRepository.findInteractionByToiletIdAndUserId(toilet.getId(), user.getId()))
                .orElseGet(() -> interactionService.addInteraction(toilet, user));

        Comment comment = new Comment();
        comment.setInteraction(interaction);
        comment.setText(commentRequest.getText());
        comment.setRatingClean(commentRequest.getRatingClean());
        comment.setRatingPaper(commentRequest.isRatingPaper());
        comment.setRatingStructure(commentRequest.getRatingStructure());
        comment.setRatingAccessibility(commentRequest.getRatingAccessibility());
        comment.setCreationDateTime(LocalDateTime.now());
        comment.setScore(0);

        Comment savedComment = Optional.of(commentRepository.save(comment))
                .orElseThrow(() -> new DatabaseSaveException("Comment"));

        return new CommentDTO(
                savedComment.getId(),
                savedComment.getInteraction().getToilet().getId(),
                savedComment.getInteraction().getUser().getId(),
                savedComment.getText(),
                savedComment.getRatingClean(),
                savedComment.isRatingPaper(),
                savedComment.getRatingStructure(),
                savedComment.getRatingAccessibility(),
                savedComment.getCreationDateTime(),
                0,
                0,
                savedComment.getScore()
        );
    }

    private List<CommentDTO> mapCommentDTOS(Collection<Comment> comments) {
        List<Integer> commentIds = comments.stream().map(Comment::getId).toList();
        List<CommentReaction> numLikes = commentReactionRepository.findCommentReactionsByCommentIdIn(commentIds);

        Map<Integer, CommentReaction> commentReactionMap = numLikes.stream()
                .collect(Collectors.toMap(CommentReaction::getCommentId, reaction -> reaction));

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
                    reaction.getNumLikes(),
                    reaction.getNumDislikes(),
                    comment.getScore()
            );
        }).toList();
    }
}
