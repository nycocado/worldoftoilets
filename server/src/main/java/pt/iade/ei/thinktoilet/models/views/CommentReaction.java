package pt.iade.ei.thinktoilet.models.views;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vw_comment_reaction")
public class CommentReaction {
    @Id
    @Column(name = "cmm_id")
    private int commentId;

    @Column(name = "likes")
    private int numLikes;

    @Column(name = "dislikes")
    private int numDislikes;
}
