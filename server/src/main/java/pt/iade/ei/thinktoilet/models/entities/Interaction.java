package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;

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

    public Interaction() {
    }

    public int getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Toilet getToilet() {
        return toilet;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setToilet(Toilet toilet) {
        this.toilet = toilet;
    }
}
