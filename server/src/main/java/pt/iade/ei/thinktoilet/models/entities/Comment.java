package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cmm_id")
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "cmm_int_id",
            referencedColumnName = "int_id",
            nullable = false
    )
    private Interaction interaction;

    @Column(name = "cmm_text")
    private String text;

    @Column(name = "cmm_rclean")
    private int ratingClean;

    @Column(name = "cmm_rstructure")
    private int ratingStructure;

    @Column(name = "cmm_raccessibility")
    private int ratingAccessibility;

    @Column(name = "cmm_rpaper")
    private boolean ratingPaper;

    @Column(name = "cmm_cdatetime")
    private LocalDateTime creationDateTime;

    @Column(name = "cmm_score")
    private int score;
}
