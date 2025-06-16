package ims.orariaperti.controller;

import ims.orariaperti.DTO.ReservationDTO;
import ims.orariaperti.entity.Reservation;
import ims.orariaperti.entity.Room;
import ims.orariaperti.repository.ReservationRepository;
import ims.orariaperti.repository.RoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public ReservationController(ReservationRepository reservationRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public ResponseEntity<?> getReservations(@RequestHeader(required = false) UUID publickey, @RequestHeader(required = false) UUID privatekey) {
        if (publickey == null && privatekey == null) {
            return ResponseEntity.badRequest().build();
        }
        if (privatekey != null) {
            Optional<?> reservationInDB = reservationRepository.findByPrivateKey(privatekey);
            if (reservationInDB.isPresent() && reservationInDB.get() instanceof Reservation reservation) {
                return ResponseEntity.ok(Map.of(
                    "reservationDetails", reservation,
                    "privateKey", reservation.getPrivateKey(),
                    "publicKey", reservation.getPublicKey()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            Optional<?> reservationInDB = reservationRepository.findByPublicKey(publickey);
            if (reservationInDB.isPresent() && reservationInDB.get() instanceof Reservation reservation) {
                return ResponseEntity.ok(Map.of(
                    "reservationDetails", reservation,
                    "publicKey", reservation.getPublicKey()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationDTO reservationDTO) {
        try {
            if (!reservationDTO.getParticipants().matches("^[A-Za-zÄäÖöÜüßèéêç ]+(, *[A-Za-zÄäÖöÜüßèéêç ]+)*$")) {
                throw new Exception("Participants field must only contain letters (A-Z, a-z) separated by commas.");
            }
            Room room = roomRepository.findById(reservationDTO.getRoomId()).orElse(null);
            if (room == null) {
                throw new Exception("Room not found. Please hard reload the page (ctrl + F5)");
            }
            for (Reservation reservation : reservationRepository.findAll()) {
                boolean isSameRoom = reservation.getRoom().getId().equals(room.getId());
                boolean isSameDate = reservation.getDate().equals(reservationDTO.getDate());
                boolean isOverlappingTime = reservationDTO.getStartTime().isBefore(reservation.getEndTime()) && reservationDTO.getEndTime().isAfter(reservation.getStartTime());
                if (isSameRoom && isSameDate && isOverlappingTime) {
                    throw new Exception("Room is already reserved for the given time and the given date.");
                }
            }
            Reservation reservationInDB = new Reservation(null, reservationDTO.getDate(), reservationDTO.getStartTime(), reservationDTO.getEndTime(), room, reservationDTO.getDescription(), reservationDTO.getParticipants(), null, null);
            reservationRepository.save(reservationInDB);
            return ResponseEntity.ok(Map.of(
                "reservation", reservationInDB,
                "privateKey", reservationInDB.getPrivateKey(),
                "publicKey", reservationInDB.getPublicKey()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable UUID id, @RequestHeader(required = false) UUID privateKey) {
        if (privateKey == null) {
            return ResponseEntity.status(401).body("Private key is required for deleting a reservation.");
        }
        Reservation reservation = reservationRepository.getFirstById(id);
        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }
        if (!reservation.getPrivateKey().equals(privateKey)) {
            return ResponseEntity.status(401).build();
        }
        reservationRepository.delete(reservation);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable UUID id, @RequestBody ReservationDTO reservationDTO, @RequestHeader(required = false) UUID privateKey) {
        if (privateKey == null) {
            return ResponseEntity.status(401).body("Private key is required for updating a reservation.");
        }
        try {
            Reservation reservation = reservationRepository.getFirstById(id);
            if (reservation == null) {
                return ResponseEntity.notFound().build();
            }
            if (!reservation.getPrivateKey().equals(privateKey)) {
                return ResponseEntity.status(401).build();
            }
            if (!reservationDTO.getParticipants().matches("^[A-Za-z\\s]+(,\\s*[A-Za-z\\s]+)*$")) {
                throw new Exception("Participants field must only contain letters (A-Z, a-z) separated by commas.");
            }
            Room room = roomRepository.findById(reservationDTO.getRoomId()).orElse(null);
            if (room == null) {
                throw new Exception("Room not found. Please hard reload the page (ctrl + F5)");
            }
            for (Reservation currentReservationFromDB : reservationRepository.findAll()) {
                boolean isSameRoom = currentReservationFromDB.getRoom().getId().equals(room.getId());
                boolean isSameDate = currentReservationFromDB.getDate().equals(reservationDTO.getDate());
                boolean isOverlappingTime = reservationDTO.getStartTime().isBefore(currentReservationFromDB.getEndTime()) && reservationDTO.getEndTime().isAfter(currentReservationFromDB.getStartTime());
                if (isSameRoom && isSameDate && isOverlappingTime && !currentReservationFromDB.getId().equals(id)) {
                    throw new Exception("Room is already reserved for the given time and the given date.");
                }
            }
            return reservationRepository.findById(id)
                    .map(existingReservation -> {
                        existingReservation.setDate(reservationDTO.getDate());
                        existingReservation.setStartTime(reservationDTO.getStartTime());
                        existingReservation.setEndTime(reservationDTO.getEndTime());
                        existingReservation.setRoom(room);
                        existingReservation.setDescription(reservationDTO.getDescription());
                        existingReservation.setParticipants(reservationDTO.getParticipants());
                        reservationRepository.save(existingReservation);
                        return ResponseEntity.ok(existingReservation);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}