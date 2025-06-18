package ims.orariaperti.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ims.orariaperti.serializer.RoomFeaturesSerializer;
import ims.orariaperti.utilities.RoomFeatures;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.UUID;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * Should contain only the numbers. **without** the "Room {nmr}" Room prefix.
     */
    private String roomNumber;

    @JsonSerialize(contentUsing = RoomFeaturesSerializer.class)
    private ArrayList<RoomFeatures> roomFeatures;

    public Room() {
    }

    public Room(UUID id, String roomNumber, ArrayList<RoomFeatures> roomFeatures) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.roomFeatures = roomFeatures;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomName) {
        this.roomNumber = roomName;
    }

    public ArrayList<RoomFeatures> getRoomFeatures() {
        return roomFeatures;
    }

    public void setRoomFeatures(ArrayList<RoomFeatures> roomFeatures) {
        this.roomFeatures = roomFeatures;
    }
}
