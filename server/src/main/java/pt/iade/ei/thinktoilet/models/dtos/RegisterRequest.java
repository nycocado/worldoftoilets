package pt.iade.ei.thinktoilet.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String name;
    private String password;
    private String email;
    private String iconId;
    private LocalDate birthDate;
}
