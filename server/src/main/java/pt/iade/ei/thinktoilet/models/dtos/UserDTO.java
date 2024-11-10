package pt.iade.ei.thinktoilet.models.dtos;

import pt.iade.ei.thinktoilet.models.entities.User;

import java.time.LocalDate;

public class UserDTO {
    private int id;
    private String name;
    private int points;
    private String iconId;
    private LocalDate creationDate;

    public UserDTO() {
    }

    public UserDTO(int id, String name, int points, String iconId, LocalDate creationDate) {
        this.id = id;
        this.name = name;
        this.points = points;
        this.iconId = iconId;
        this.creationDate = creationDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getIconId() {
        return iconId;
    }

    public void setIconId(String iconId) {
        this.iconId = iconId;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }
}
