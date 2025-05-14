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
    private LocalTime from;

    @Column(nullable = false)
    private LocalTime until;

    @Column(nullable = false)
    private int room;

    @Column(nullable = false, columnDefinition = "VARCHAR(200)")
    private String description;

    @Column(nullable = false, columnDefinition = "VARCHAR(255) CHECK (participants ~ '^[A-Za-z]+(,[A-Za-z]+)*$')")
    private String participants;

    public Reservation() {
    }

    public Reservation(UUID id, LocalDate date, LocalTime from, LocalTime until, int room, String description, String participants) {
        this.id = id;
        this.date = date;
        this.from = from;
        this.until = until;
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

    public LocalTime getFrom() {
        return from;
    }

    public void setFrom(LocalTime from) {
        this.from = from;
    }

    public LocalTime getUntil() {
        return until;
    }

    public void setUntil(LocalTime until) {
        this.until = until;
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
}
