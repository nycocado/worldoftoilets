package pt.iade.ei.thinktoilet.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pt.iade.ei.thinktoilet.models.entities.TypeExtra;
import pt.iade.ei.thinktoilet.models.views.Rating;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToiletDTO {
    private int id;
    private String name;
    private String address;
    private Rating rating;
    private List<String> extras;
    private Double latitude;
    private Double longitude;
    private int numComments;
    private String placeId;
}
