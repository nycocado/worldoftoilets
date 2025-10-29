package pt.iade.ei.thinktoilet.models.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReactionRequest {
    private int commentId;
    private int userId;
    private String typeReaction;
}
