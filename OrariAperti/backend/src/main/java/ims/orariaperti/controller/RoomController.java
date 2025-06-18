package ims.orariaperti.controller;

import ims.orariaperti.entity.Room;
import ims.orariaperti.entity.Reservation;
import ims.orariaperti.repository.RoomRepository;
import ims.orariaperti.repository.ReservationRepository;
import ims.orariaperti.utilities.RoomFeatures;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@RequestMapping("/api/room")
@RestController
public class RoomController {
    
    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    
    @GetMapping
    public Object getRooms() {
        List<Room> roomsInDB = roomRepository.findAll();
        if (!roomsInDB.isEmpty()) {
            ArrayList<Object> rooms = new ArrayList<>();
            for (Room room : roomsInDB) {
                rooms.add(Map.of(
                    "id", room.getId(),
                    "roomNumber", room.getRoomNumber(),
                    "roomFeatures", room.getRoomFeatures().stream().map(RoomFeatures::getFeature).toList()
                ));
            }
            return ResponseEntity.ok(rooms);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
