package pt.iade.ei.thinktoilet.models.views;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vw_user_report_comment")
public class UserReportComment {
    @Id
    @Column(name = "cmm_id")
    private int commentId;

    @Column(name = "user_id")
    private int userId;
}
