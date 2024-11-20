package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
import pt.iade.ei.thinktoilet.models.views.Rating;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "toilet")
public class Toilet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "toil_id")
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "toil_city_id",
            referencedColumnName = "city_id",
            nullable = false
    )
    private City city;

    @ManyToOne
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

    public ToiletDTO toDTO(Rating rating, int numComments, List<Extra> extras) {
        return new ToiletDTO(this, rating, numComments, extras);
    }
}