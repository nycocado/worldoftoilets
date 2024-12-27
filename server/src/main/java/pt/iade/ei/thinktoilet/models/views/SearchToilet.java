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
@Table(name = "vw_search_toilet")
public class SearchToilet {
    @Id
    @Column(name = "toil_id")
    public int id;

    @Column(name = "toil_name")
    public String name;

    @Column(name = "toil_address")
    public String address;
}
