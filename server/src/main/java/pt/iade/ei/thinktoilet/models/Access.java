package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;

@Entity
@Table(name = "access")
public class Access {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "acs_id")
    private int id;

    @Column(name = "acs_name")
    private String name;

    public Access() {
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
