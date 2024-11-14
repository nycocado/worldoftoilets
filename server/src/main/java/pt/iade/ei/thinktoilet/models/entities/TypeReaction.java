package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "typereaction")
public class TypeReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trc_id")
    private int id;

    @Column(name = "trc_name")
    private String name;
}