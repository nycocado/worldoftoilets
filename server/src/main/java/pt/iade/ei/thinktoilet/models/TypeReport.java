package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;

@Entity
@Table(name = "typereport")
public class TypeReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trp_id")
    private int id;

    @Column(name = "trp_name")
    private String name;

    public TypeReport() {
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
