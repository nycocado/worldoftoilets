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

    @Column(name = "user_name", unique = true)
    private String name;

    @Column(name = "user_email", unique = true)
    private String email;

    @Column(name = "user_pwd")
    private String password;

    @Column(name = "user_points")
    private int points;

    @Column(name = "user_iconid")
    private String iconId;

    @Column(name = "user_bdate")
    private LocalDate birthDate;

    @Column(name = "user_cdate")
    private LocalDate creationDate;

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

    public String getPassword() {
        return password;
    }

    public int getPoints() {
        return points;
    }

    public String getIconId() {
        return iconId;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public LocalDate getCreationDate() {
        return creationDate;
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

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setIconId(String iconId) {
        this.iconId = iconId;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }
}
