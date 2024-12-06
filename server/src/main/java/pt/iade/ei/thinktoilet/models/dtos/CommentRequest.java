package pt.iade.ei.thinktoilet.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    private int toiletId;
    private int userId;
    private String text;
    private int ratingClean;
    private boolean ratingPaper;
    private int ratingStructure;
    private int ratingAccessibility;
}
