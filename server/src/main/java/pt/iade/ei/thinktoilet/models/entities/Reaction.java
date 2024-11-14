package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "reaction")
public class Reaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "react_id")
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "react_user_id",
            referencedColumnName = "user_id",
            nullable = false
    )
    private User user;

    @ManyToOne
    @JoinColumn(
            name = "react_cmm_id",
            referencedColumnName = "cmm_id",
            nullable = false
    )
    private Comment comment;

    @ManyToOne
    @JoinColumn(
            name = "react_trc_id",
            referencedColumnName = "trc_id",
            nullable = false
    )
    private TypeReaction typeReaction;

    @Column(name = "react_cdate")
    private LocalDate creationDate;
}
