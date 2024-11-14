package pt.iade.ei.thinktoilet.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private int id;
    private String name;
    private int points;
    private String iconId;
    private LocalDate creationDate;
}
