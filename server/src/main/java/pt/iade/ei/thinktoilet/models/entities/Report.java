package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rep_id")
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "rep_trp_id",
            referencedColumnName = "trp_id",
            nullable = false
    )
    private TypeReport typeReport;

    @ManyToOne
    @JoinColumn(
            name = "rep_int_id",
            referencedColumnName = "int_id",
            nullable = false
    )
    private Interaction interaction;

    @Column(name = "rep_cdate")
    private LocalDate creationDate;
}
