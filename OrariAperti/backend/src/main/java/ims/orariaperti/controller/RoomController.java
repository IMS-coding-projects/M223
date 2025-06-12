package ims.orariaperti.controller;

import ims.orariaperti.entity.Room;
import ims.orariaperti.entity.Reservation;
import ims.orariaperti.repository.RoomRepository;
import ims.orariaperti.repository.ReservationRepository;
import ims.orariaperti.utilities.RoomFeatures;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
@RequestMapping("/api/room")
@RestController
public class RoomController {
    
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public RoomController(RoomRepository roomRepository, ReservationRepository reservationRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
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

    @GetMapping("/{roomId}/reservations")
    public ResponseEntity<?> getReservationsForRoom(@PathVariable UUID roomId) {
        var roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Reservation> reservations = reservationRepository.findAll().stream()
            .filter(r -> r.getRoom() != null && r.getRoom().getId().equals(roomId))
            .toList();
        return ResponseEntity.ok(reservations);
    }

}
