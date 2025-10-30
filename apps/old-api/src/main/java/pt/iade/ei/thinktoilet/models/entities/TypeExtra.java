package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "typeextra")
public class TypeExtra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tex_id")
    private int id;

    @Column(name = "tex_name", length = 50)
    private String name;

    @Column(name = "tex_technical_name", length = 50)
    private String technicalName;
}
