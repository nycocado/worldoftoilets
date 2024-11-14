package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "interaction")
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "int_id")
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "int_user_id",
            referencedColumnName = "user_id",
            nullable = false
    )
    private User user;

    @ManyToOne
    @JoinColumn(
            name = "int_toil_id",
            referencedColumnName = "toil_id",
            nullable = false
    )
    private Toilet toilet;
}
