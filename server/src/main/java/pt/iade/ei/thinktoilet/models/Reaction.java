package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;
import java.time.LocalDate;

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

    public Reaction() {
    }

    public int getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Comment getComment() {
        return comment;
    }

    public TypeReaction getTypeReaction() {
        return typeReaction;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public void setTypeReaction(TypeReaction typeReaction) {
        this.typeReaction = typeReaction;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }
}
