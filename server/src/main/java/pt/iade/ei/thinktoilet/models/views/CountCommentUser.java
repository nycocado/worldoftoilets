package pt.iade.ei.thinktoilet.models.views;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "vw_count_comment_user")
public class CountCommentUser {
    @Id
    @Column(name = "user_id")
    private int userId;

    @Column(name = "comments")
    private int num;
}
