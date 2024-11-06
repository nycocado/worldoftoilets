package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;

@Entity
@Table(name = "typeextra")
public class TypeExtra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tex_id")
    private int id;

    @Column(name = "tex_name")
    private String name;

    public TypeExtra() {
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
