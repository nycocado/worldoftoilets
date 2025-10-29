package pt.iade.ei.thinktoilet.models.requests;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    private int toiletId;
    private int userId;
    @Size(max = 280)
    private String text;
    private int ratingClean;
    private boolean ratingPaper;
    private int ratingStructure;
    private int ratingAccessibility;
}
