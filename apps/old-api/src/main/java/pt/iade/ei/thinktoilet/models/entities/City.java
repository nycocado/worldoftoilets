package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "city")
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private int id;

    @Column(name = "city_name", length = 50)
    private String name;

    @Column(name = "city_technical_name", length = 50)
    private String technicalName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "city_country_id",
            referencedColumnName = "country_id",
            nullable = false
    )
    private Country country;
}
