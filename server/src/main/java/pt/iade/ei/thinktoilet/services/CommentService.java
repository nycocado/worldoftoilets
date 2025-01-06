package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.DatabaseSaveException;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import pt.iade.ei.thinktoilet.models.entities.Interaction;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.models.mappers.CommentMapper;
import pt.iade.ei.thinktoilet.models.requests.CommentRequest;
import pt.iade.ei.thinktoilet.repositories.CommentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
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

    public List<Comment> getCommentsByToiletId(int toiletId) {
        return commentRepository.findCommentsByToiletId(toiletId);
    }

    public List<Comment> getCommentsByToiletId(int toiletId, Pageable pageable) {
        return commentRepository.findCommentsByToiletId(toiletId, pageable);
    }

    public List<Comment> getCommentsByToiletIdForUserId(int toiletId, int userId) {
        return commentRepository.findCommentsByToiletIdForUserId(toiletId, userId);
    }

    public List<Comment> getCommentsByToiletIdForUserId(int toiletId, int userId, Pageable pageable) {
        return commentRepository.findCommentsByToiletIdForUserId(toiletId, userId, pageable);
    }

    public List<Comment> getCommentsByUserId(int userId) {
        return commentRepository.findCommentsByUserId(userId);
    }

    public List<Comment> getCommentsByUserId(int userId, Pageable pageable) {
        return commentRepository.findCommentsByUserId(userId, pageable);
    }

    public boolean existsCommentById(int id) {
        return commentRepository.existsCommentById(id);
    }

    public Comment saveComment(Comment comment) {
        return Optional.of(commentRepository.save(comment))
                .orElseThrow(() -> new DatabaseSaveException("Comment"));
    }

    @Transactional
    public List<CommentDTO> findCommentsByToiletId(int toiletId) {
        List<Comment> comments = getCommentsByToiletId(toiletId);
        return commentMapper.mapCommentDTOS(comments);
    }

    @Transactional
    public List<CommentDTO> findCommentsByToiletId(int toiletId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        List<Comment> comments = getCommentsByToiletId(toiletId, pageable);
        return commentMapper.mapCommentDTOS(comments);
    }

    @Transactional
    public List<CommentDTO> findCommentsByToiletIdForUserId(int toiletId, int userId) {
        List<Comment> comments = getCommentsByToiletIdForUserId(toiletId, userId);
        return commentMapper.mapCommentDTOS(comments);
    }

    @Transactional
    public List<CommentDTO> findCommentsByToiletIdForUserId(int toiletId, int userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        List<Comment> comments = getCommentsByToiletIdForUserId(toiletId, userId, pageable);
        return commentMapper.mapCommentDTOS(comments);
    }

    @Transactional
    public List<CommentDTO> findCommentsByUserId(int userId) {
        List<Comment> comments = getCommentsByUserId(userId);
        return commentMapper.mapCommentDTOS(comments);
    }

    @Transactional
    public List<CommentDTO> findCommentsByUserId(int userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        List<Comment> comments = getCommentsByUserId(userId, pageable);
        return commentMapper.mapCommentDTOS(comments);
    }

    @Transactional
    public CommentDTO addComment(CommentRequest commentRequest) {
        User user = userService.getUserById(commentRequest.getUserId());
        Toilet toilet = toiletService.getToiletById(commentRequest.getToiletId());
        Interaction interaction = interactionService.getInteractionByToiletAndUser(toilet, user);

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