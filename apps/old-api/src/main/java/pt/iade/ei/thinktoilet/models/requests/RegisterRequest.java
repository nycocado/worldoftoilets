package pt.iade.ei.thinktoilet.models.requests;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @Size(min = 6, max = 50)
    private String name;
    @Size(max = 100)
    private String email;
    @Size(min = 6)
    private String password;
    private String iconId;
    private LocalDate birthDate;
}
