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
@Table(name = "view_likes")
public class Likes {
    @Id
    @Column(name = "cmm_id")
    private int commentId;

    @Column(name = "likes")
    private int likes;
}
