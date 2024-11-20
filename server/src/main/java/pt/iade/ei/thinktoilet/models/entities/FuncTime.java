package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "functime")
public class FuncTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ft_id")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "ft_toil_id",
            referencedColumnName = "toil_id",
            nullable = false
    )
    private Toilet toilet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "ft_day_id",
            referencedColumnName = "day_id",
            nullable = false
    )
    private Day day;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "ft_state_id",
            referencedColumnName = "state_id",
            nullable = false
    )
    private State state;

    @Column(name = "ft_timestart")
    private LocalTime timeStart;

    @Column(name = "ft_timeend")
    private LocalTime timeEnd;

    @Column(name = "ft_cdate")
    private LocalDate creationDate;
}
