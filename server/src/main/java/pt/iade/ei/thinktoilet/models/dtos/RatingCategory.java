package pt.iade.ei.thinktoilet.models.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RatingCategory {
    private int id;
    private double clean;
    private double paper;
    private double structure;
    private double accessibility;

    public RatingCategory(int id, Double clean, Double paper, Double structure, Double accessibility) {
        this.id = id;
        this.clean = (clean != null) ? clean : 0.0f;
        this.paper = (paper != null) ? paper : 0.0f;
        this.structure = (structure != null) ? structure : 0.0f;
        this.accessibility = (accessibility != null) ? accessibility : 0.0f;
    }

    public RatingCategoryDTO toDTO() {
        return new RatingCategoryDTO(clean, paper, structure, accessibility);
    }
}
