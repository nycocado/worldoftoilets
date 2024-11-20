package pt.iade.ei.thinktoilet.models.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import pt.iade.ei.thinktoilet.models.entities.Comment;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CommentDTO {
    private int id;
    private int toiletId;
    private int userId;
    private String text;
    private int ratingClean;
    private boolean ratingPaper;
    private int ratingStructure;
    private int ratingAccessibility;
    private LocalDateTime datetime;
    private int numLikes;
    private int numDislikes;
    private int score;

    public CommentDTO(Comment comment, int numLikes, int numDislikes) {
        this.id = comment.getId();
        this.toiletId = comment.getInteraction().getToilet().getId();
        this.userId = comment.getInteraction().getUser().getId();
        this.text = comment.getText();
        this.ratingClean = comment.getRatingClean();
        this.ratingPaper = comment.isRatingPaper();
        this.ratingStructure = comment.getRatingStructure();
        this.ratingAccessibility = comment.getRatingAccessibility();
        this.datetime = comment.getCreationDateTime();
        this.numLikes = numLikes;
        this.numDislikes = numDislikes;
        this.score = comment.getScore();
    }
}
