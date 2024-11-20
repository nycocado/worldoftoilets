package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "toilet")
public class Toilet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "toil_id")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "toil_city_id",
            referencedColumnName = "city_id",
            nullable = false
    )
    private City city;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "toil_acs_id",
            referencedColumnName = "acs_id",
            nullable = false
    )
    private Access access;

    @Column(name = "toil_name")
    private String name;

    @Column(name = "toil_lat")
    private double latitude;

    @Column(name = "toil_long")
    private double longitude;

    @Column(name = "toil_address")
    private String address;

    @Column(name = "toil_placeid", unique = true)
    private String placeId;

    @Column(name = "toil_cdate")
    private LocalDate creationDate;

    @Column(name = "toil_image")
    private String image;
}