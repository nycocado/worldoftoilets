package pt.iade.ei.thinktoilet.models.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RatingCategoryDTO {
    private double clean;
    private double paper;
    private double structure;
    private double accessibility;

    public RatingCategoryDTO(Double clean, Double paper, Double structure, Double accessibility) {
        this.clean = (clean != null) ? clean : 0.0f;
        this.paper = (paper != null) ? paper : 0.0f;
        this.structure = (structure != null) ? structure : 0.0f;
        this.accessibility = (accessibility != null) ? accessibility : 0.0f;
    }
}
