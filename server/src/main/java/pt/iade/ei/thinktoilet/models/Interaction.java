package pt.iade.ei.thinktoilet.models;

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
            name = "int_acs_id",
            referencedColumnName = "acs_id",
            nullable = false
    )
    private Access access;

    public Interaction() {
    }

    public int getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Access getAccess() {
        return access;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setAccess(Access access) {
        this.access = access;
    }
}
