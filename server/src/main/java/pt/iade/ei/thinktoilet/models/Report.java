package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;
import java.time.LocalDate;

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

    public Report() {
    }

    public int getId() {
        return id;
    }

    public TypeReport getTypeReport() {
        return typeReport;
    }

    public Interaction getInteraction() {
        return interaction;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTypeReport(TypeReport typeReport) {
        this.typeReport = typeReport;
    }

    public void setInteraction(Interaction interaction) {
        this.interaction = interaction;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }
}
