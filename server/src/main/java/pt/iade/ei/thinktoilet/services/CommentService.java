package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.DatabaseSaveException;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.dtos.CommentRequest;
import pt.iade.ei.thinktoilet.models.entities.*;
import pt.iade.ei.thinktoilet.models.mappers.CommentMapper;
import pt.iade.ei.thinktoilet.repositories.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private CommentPagingRepository commentPagingRepository;
    @Autowired
    private ToiletService toiletService;
    @Autowired
    private UserService userService;
    @Autowired
    private InteractionService interactionService;
    @Autowired
    private CommentMapper commentMapper;

    public Comment getCommentById(int id) {
        return Optional.ofNullable(commentRepository.findCommentById(id))
                .orElseThrow(() -> new NotFoundException(String.valueOf(id), "Comment", "id"));
    }

    public List<Comment> getCommentByToiletId(int toiletId) {
        return Optional.ofNullable(commentRepository.findCommentsByInteractionToiletId(toiletId))
                .orElseThrow(() -> new NotFoundException(String.valueOf(toiletId), "Comment", "toilet id"));
    }

    public List<Comment> getCommentByUserId(int userId) {
        return Optional.ofNullable(commentRepository.findCommentsByInteractionUserId(userId))
                .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Comment", "user id"));
    }

    public Page<Comment> getCommentByToiletIdPaging(int toiletId, Pageable pageable) {
        return Optional.ofNullable(commentPagingRepository.findCommentsByInteractionToiletId(toiletId, pageable))
                .orElseThrow(() -> new NotFoundException(String.valueOf(toiletId), "Comment", "toilet id"));
    }

    public Page<Comment> getCommentByUserIdPaging(int userId, Pageable pageable) {
        return Optional.ofNullable(commentPagingRepository.findCommentsByInteractionUserId(userId, pageable))
                .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Comment", "user id"));
    }

    public Comment saveComment(Comment comment) {
        return Optional.of(commentRepository.save(comment))
                .orElseThrow(() -> new DatabaseSaveException("Comment"));
    }

    @Transactional
    public List<CommentDTO> findCommentsByToiletId(int toiletId) {
        List<Comment> comments = getCommentByToiletId(toiletId);
        return commentMapper.mapCommentDTOS(comments);
    }

    @Transactional
    public List<CommentDTO> findCommentsByUserId(int userId) {
        List<Comment> comments = getCommentByUserId(userId);
        return commentMapper.mapCommentDTOS(comments);
    }

    @Transactional
    public Page<CommentDTO> findCommentsByToiletIdPaging(int toiletId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = getCommentByToiletIdPaging(toiletId, pageable);
        return new PageImpl<>(commentMapper.mapCommentDTOS(comments.getContent()), pageable, comments.getTotalElements());
    }

    @Transactional
    public Page<CommentDTO> findCommentsByUserIdPaging(int userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Comment> comments = getCommentByUserIdPaging(userId, pageable);
        return new PageImpl<>(commentMapper.mapCommentDTOS(comments.getContent()), pageable, comments.getTotalElements());
    }

    @Transactional
    public CommentDTO addComment(CommentRequest commentRequest) {
        User user = userService.getUserById(commentRequest.getUserId());
        Toilet toilet = toiletService.getToiletById(commentRequest.getToiletId());
        Interaction interaction = interactionService.getInteractionById(toilet, user);

        Comment comment = new Comment();
        comment.setInteraction(interaction);
        comment.setText(commentRequest.getText());
        comment.setRatingClean(commentRequest.getRatingClean());
        comment.setRatingPaper(commentRequest.isRatingPaper());
        comment.setRatingStructure(commentRequest.getRatingStructure());
        comment.setRatingAccessibility(commentRequest.getRatingAccessibility());
        comment.setCreationDateTime(LocalDateTime.now());
        comment.setScore(0);

        Comment savedComment = saveComment(comment);

        return commentMapper.mapCommentDTO(savedComment);
    }
}
