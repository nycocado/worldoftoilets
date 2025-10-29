package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "typereport")
public class TypeReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trp_id")
    private int id;

    @Column(name = "trp_name", length = 50)
    private String name;

    @Column(name = "trp_technical_name", length = 50)
    private String technicalName;
}
