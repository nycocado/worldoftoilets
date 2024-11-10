package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "typereaction")
public class TypeReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trc_id")
    private int id;

    @Column(name = "trc_name")
    private String name;

    public TypeReaction() {
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}