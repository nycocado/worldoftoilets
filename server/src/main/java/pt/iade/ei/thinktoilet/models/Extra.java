package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;

@Entity
@Table(name = "extra")
public class Extra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "extra_id")
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "extra_toil_id",
            referencedColumnName = "toil_id",
            nullable = false
    )
    private Toilet toilet;

    @ManyToOne
    @JoinColumn(
            name = "extra_tex_id",
            referencedColumnName = "tex_id",
            nullable = false
    )
    private TypeExtra typeExtra;

    public Extra() {
    }

    public int getId() {
        return id;
    }

    public Toilet getToilet() {
        return toilet;
    }

    public TypeExtra getTypeExtra() {
        return typeExtra;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setToilet(Toilet toilet) {
        this.toilet = toilet;
    }

    public void setTypeExtra(TypeExtra typeExtra) {
        this.typeExtra = typeExtra;
    }
}
