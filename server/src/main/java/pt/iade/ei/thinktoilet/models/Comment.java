package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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
    private int rclean;

    @Column(name = "cmm_rpaper")
    private int rpaper;

    @Column(name = "cmm_rstructure")
    private int rstructure;

    @Column(name = "cmm_raccessibility")
    private int raccessibility;

    @Column(name = "cmm_cdatetime")
    private LocalDateTime cdatetime;

    public Comment() {
    }

    public int getId() {
        return id;
    }

    public Interaction getInteraction() {
        return interaction;
    }

    public String getText() {
        return text;
    }

    public int getRclean() {
        return rclean;
    }

    public int getRpaper() {
        return rpaper;
    }

    public int getRstructure() {
        return rstructure;
    }

    public int getRaccessibility() {
        return raccessibility;
    }

    public LocalDateTime getCdatetime() {
        return cdatetime;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setInteraction(Interaction interaction) {
        this.interaction = interaction;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setRclean(int rclean) {
        this.rclean = rclean;
    }

    public void setRpaper(int rpaper) {
        this.rpaper = rpaper;
    }

    public void setRstructure(int rstructure) {
        this.rstructure = rstructure;
    }

    public void setRaccessibility(int raccessibility) {
        this.raccessibility = raccessibility;
    }

    public void setCdatetime(LocalDateTime cdatetime) {
        this.cdatetime = cdatetime;
    }
}
