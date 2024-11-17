package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pt.iade.ei.thinktoilet.models.dtos.ExtraDTO;

@Data
@NoArgsConstructor
@Entity
@Table(name = "extra")
public class Extra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "extra_id")
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "extra_toil_id",
            referencedColumnName = "toil_id",
            nullable = false
    )
    private Toilet toilet;

    @ManyToOne
    @JoinColumn(
            name = "extra_tex_id",
            referencedColumnName = "tex_id",
            nullable = false
    )
    private TypeExtra typeExtra;

    public ExtraDTO toDTO() {
        return new ExtraDTO(this.getTypeExtra().getId());
    }
}
