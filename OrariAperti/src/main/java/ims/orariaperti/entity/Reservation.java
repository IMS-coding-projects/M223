package ims.orariaperti.entity;

import ims.orariaperti.model.Roles;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private int room;

    @Column(nullable = false, columnDefinition = "VARCHAR(200)")
    private String description;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String participants;

    public Reservation() {
    }

    public Reservation(UUID id, LocalDate date, LocalTime from, LocalTime until, int room, String description, String participants) {
        this.id = id;
        this.date = date;
        this.startTime = from;
        this.endTime = until;
        this.room = room;
        this.description = description;
        this.participants = participants;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getFromTime() {
        return startTime;
    }

    public void setFromTime(LocalTime from) {
        this.startTime = from;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public int getRoom() {
        return room;
    }

    public void setRoom(int room) {
        this.room = room;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getParticipants() {
        return participants;
    }

    public void setParticipants(String participants) {
        this.participants = participants;
    }

    @Override
    public String toString() {
        return "Reservation{" +
                "id=" + id +
                ", date=" + date +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", room=" + room +
                ", description='" + description + '\'' +
                ", participants='" + participants + '\'' +
                '}';
    }
}
