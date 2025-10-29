package pt.iade.ei.thinktoilet.models.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApiResponse {
    private int status;
    private String message;
    private String timestamp;

    public ApiResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now().toString();
    }
}
