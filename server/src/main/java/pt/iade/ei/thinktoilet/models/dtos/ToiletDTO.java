package pt.iade.ei.thinktoilet.models.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import pt.iade.ei.thinktoilet.models.entities.Extra;
import pt.iade.ei.thinktoilet.models.entities.Toilet;

import java.util.List;

@Data
@NoArgsConstructor
public class ToiletDTO {
    private int id;
    private String name;
    private String address;
    private RatingCategoryDTO rating;
    private List<ExtraDTO> extras;
    private Double latitude;
    private Double longitude;
    private int numComments;
    private String placeId;
    private String image;

    public ToiletDTO(Toilet toilet, RatingCategoryDTO rating, int numComments, List<Extra> extras) {
        this.id = toilet.getId();
        this.name = toilet.getName();
        this.address = toilet.getAddress();
        this.rating = (rating != null) ? rating : new RatingCategoryDTO();
        this.extras = extras.stream().map(Extra::toDTO).toList();
        this.latitude = toilet.getLatitude();
        this.longitude = toilet.getLongitude();
        this.numComments = numComments;
        this.placeId = toilet.getPlaceId();
        this.image = toilet.getImage();
    }
}
