package pt.iade.ei.thinktoilet.models.entities;

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
    private int ratingClean;

    @Column(name = "cmm_rpaper")
    private int ratingPaper;

    @Column(name = "cmm_rstructure")
    private int ratingStructure;

    @Column(name = "cmm_raccessibility")
    private int ratingAccessibility;

    @Column(name = "cmm_cdatetime")
    private LocalDateTime creationDateTime;

    @Column(name = "cmm_score")
    private int score;

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

    public int getRatingClean() {
        return ratingClean;
    }

    public int getRatingPaper() {
        return ratingPaper;
    }

    public int getRatingStructure() {
        return ratingStructure;
    }

    public int getRatingAccessibility() {
        return ratingAccessibility;
    }

    public LocalDateTime getCreationDateTime() {
        return creationDateTime;
    }

    public int getScore() {
        return score;
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

    public void setRatingClean(int ratingClean) {
        this.ratingClean = ratingClean;
    }

    public void setRatingPaper(int ratingPaper) {
        this.ratingPaper = ratingPaper;
    }

    public void setRatingStructure(int ratingStructure) {
        this.ratingStructure = ratingStructure;
    }

    public void setRatingAccessibility(int ratingAccessibility) {
        this.ratingAccessibility = ratingAccessibility;
    }

    public void setCreationDateTime(LocalDateTime creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
