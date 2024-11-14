package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "access")
public class Access {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "acs_id")
    private int id;

    @Column(name = "acs_name")
    private String name;
}
