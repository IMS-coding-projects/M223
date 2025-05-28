package ims.orariaperti.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(nullable = false, columnDefinition = "VARCHAR(255)") //regex missing, has to be done in backend
    private String participants;

    @Column(nullable = false, unique = true)
    @JsonIgnore
    private UUID privateKey;

    @Column(nullable = false, unique = true)
    @JsonIgnore
    private UUID publicKey;

    public Reservation() {
    }

    public Reservation(UUID id, LocalDate date, LocalTime startTime, LocalTime endTime, int room, String description, String participants, UUID privateKey, UUID publicKey) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
        this.description = description;
        this.participants = participants;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    @PrePersist
    // an attribute to modify fields before the entity is saved in the database. (this replaces the @generatedvalue tag, that only works on id's)
    public void generateKeys() {
        if (this.privateKey == null) {
            this.privateKey = UUID.randomUUID();
        }
        if (this.publicKey == null) {
            this.publicKey = UUID.randomUUID();
        }
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

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
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

    public UUID getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(UUID privateKey) {
        this.privateKey = privateKey;
    }

    public UUID getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(UUID publicKey) {
        this.publicKey = publicKey;
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
                ", privateKey=" + privateKey +
                ", publicKey=" + publicKey +
                '}';
    }
}
