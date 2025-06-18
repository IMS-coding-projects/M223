package ims.orariaperti.DTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class ReservationDTO {
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private UUID roomId;
    private String description;
    private String participants;

    public ReservationDTO() {
    }

    public ReservationDTO(LocalDate date, LocalTime startTime, LocalTime endTime, UUID roomId, String description, String participants) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.roomId = roomId;
        this.description = description;
        this.participants = participants;
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

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
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
                ", date=" + date +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", roomId=" + roomId +
                ", description='" + description + '\'' +
                ", participants='" + participants + '\'' +
                '}';
    }
}