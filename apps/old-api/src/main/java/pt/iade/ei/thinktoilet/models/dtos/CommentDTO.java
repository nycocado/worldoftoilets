package pt.iade.ei.thinktoilet.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
