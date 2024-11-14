package pt.iade.ei.thinktoilet.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
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
}
