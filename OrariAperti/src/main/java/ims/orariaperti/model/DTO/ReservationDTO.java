package ims.orariaperti.model.DTO;

import ims.orariaperti.entity.User;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class ReservationDTO {
    private UUID userId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private int room;
    private String description;
    private String participants;

    public ReservationDTO() {
    }

    public ReservationDTO(UUID userId, LocalDate date, LocalTime startTime, LocalTime endTime, int room, String description, String participants) {
        this.userId = userId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
        this.description = description;
        this.participants = participants;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    @Override
    public String toString() {
        return "ReservationDTO{" +
                "userId=" + userId +
                ", date=" + date +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", room=" + room +
                ", description='" + description + '\'' +
                ", participants='" + participants + '\'' +
                '}';
    }
}