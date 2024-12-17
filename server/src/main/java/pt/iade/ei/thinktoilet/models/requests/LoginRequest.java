package pt.iade.ei.thinktoilet.models.requests;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @Size(max = 100)
    private String email;
    @Size(min = 6)
    private String password;
}
