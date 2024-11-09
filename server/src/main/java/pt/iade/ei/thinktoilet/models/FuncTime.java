package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "functime")
public class FuncTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ft_id")
    private int id;

    @ManyToOne
    @JoinColumn(
            name = "ft_toil_id",
            referencedColumnName = "toil_id",
            nullable = false
    )
    private Toilet toilet;

    @ManyToOne
    @JoinColumn(
            name = "ft_day_id",
            referencedColumnName = "day_id",
            nullable = false
    )
    private Day day;

    @ManyToOne
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

    public FuncTime() {
    }

    public int getId() {
        return id;
    }

    public Toilet getToilet() {
        return toilet;
    }

    public Day getDay() {
        return day;
    }

    public State getState() {
        return state;
    }

    public LocalTime getTimeStart() {
        return timeStart;
    }

    public LocalTime getTimeEnd() {
        return timeEnd;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setToilet(Toilet toilet) {
        this.toilet = toilet;
    }

    public void setDay(Day day) {
        this.day = day;
    }

    public void setState(State state) {
        this.state = state;
    }

    public void setTimeStart(LocalTime timeStart) {
        this.timeStart = timeStart;
    }

    public void setTimeEnd(LocalTime timeEnd) {
        this.timeEnd = timeEnd;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }
}
