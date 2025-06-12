package ims.orariaperti.controller;

import ims.orariaperti.DTO.ReservationDTO;
import ims.orariaperti.entity.Reservation;
import ims.orariaperti.entity.Room;
import ims.orariaperti.repository.ReservationRepository;
import ims.orariaperti.repository.RoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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
    public Object getReservations(@RequestHeader(required = false) UUID publickey, @RequestHeader(required = false) UUID privatekey) {
        if (publickey == null && privatekey == null) {
            return ResponseEntity.badRequest().build();
        }
        if (privatekey != null) {
            Optional<Object> reservationInDB = reservationRepository.findByPrivateKey(privatekey);
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
            Optional<Object> reservationInDB = reservationRepository.findByPublicKey(publickey);
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
    public ResponseEntity<Object> createReservation(@RequestBody ReservationDTO reservationDTO) {
        try {
            if (!reservationDTO.getParticipants().matches("^[A-Za-z\\s]+(,\\s*[A-Za-z\\s]+)*$")) {
                throw new Exception("Participants field must only contain letters (A-Z, a-z) separated by commas.");
            }
            Room room = roomRepository.findById(reservationDTO.getRoomId()).orElse(null);
            if (room == null) {
                throw new Exception("Room not found.");
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
    public ResponseEntity<Void> deleteReservation(@PathVariable UUID id, @RequestHeader UUID privateKey) {
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
    public ResponseEntity<Reservation> updateReservation(@PathVariable UUID id, @RequestBody ReservationDTO reservationDTO, @RequestHeader UUID privateKey) {
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
                throw new Exception("Room not found.");
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
            return ResponseEntity.badRequest().build();
        }
    }

}