package pt.iade.ei.thinktoilet.models.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pt.iade.ei.thinktoilet.models.dtos.CommentDTO;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import pt.iade.ei.thinktoilet.models.views.CommentReaction;
import pt.iade.ei.thinktoilet.repositories.CommentReactionRepository;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CommentMapper {
    @Autowired
    CommentReactionRepository commentReactionRepository;

    public CommentDTO mapCommentDTO(Comment comment) {
        CommentReaction reaction = commentReactionRepository.findCommentReactionByCommentId(comment.getId());
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
    }

    public List<CommentDTO> mapCommentDTOS(Collection<Comment> comments) {
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
