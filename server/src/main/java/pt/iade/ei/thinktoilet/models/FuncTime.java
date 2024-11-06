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
    private LocalTime timestart;

    @Column(name = "ft_timeend")
    private LocalTime timeend;

    @Column(name = "ft_cdate")
    private LocalDate cdate;

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

    public LocalTime getTimestart() {
        return timestart;
    }

    public LocalTime getTimeend() {
        return timeend;
    }

    public LocalDate getCdate() {
        return cdate;
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

    public void setTimestart(LocalTime timestart) {
        this.timestart = timestart;
    }

    public void setTimeend(LocalTime timeend) {
        this.timeend = timeend;
    }

    public void setCdate(LocalDate cdate) {
        this.cdate = cdate;
    }
}
