package pt.iade.ei.thinktoilet.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int id;

    @Column(name = "user_name")
    private String name;

    @Column(name = "user_email")
    private String email;

    @Column(name = "user_pwd")
    private String pwd;

    @Column(name = "user_points")
    private int points;

    @Column(name = "user_iconid")
    private String iconId;

    @Column(name = "user_bdate")
    private LocalDate bdate;

    @Column(name = "user_cdate")
    private LocalDate cdate;

    public User() {
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPwd() {
        return pwd;
    }

    public int getPoints() {
        return points;
    }

    public String getIconId() {
        return iconId;
    }

    public LocalDate getBdate() {
        return bdate;
    }

    public LocalDate getCdate() {
        return cdate;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setIconId(String iconId) {
        this.iconId = iconId;
    }

    public void setBdate(LocalDate bdate) {
        this.bdate = bdate;
    }

    public void setCdate(LocalDate cdate) {
        this.cdate = cdate;
    }
}
