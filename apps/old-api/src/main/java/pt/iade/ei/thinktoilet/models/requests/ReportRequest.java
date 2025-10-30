package pt.iade.ei.thinktoilet.models.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    private int toiletId;
    private int userId;
    private String typeReport;
}
