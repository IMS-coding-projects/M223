package ims.orariaperti.controller;

import ims.orariaperti.DTO.ReservationDTO;
import ims.orariaperti.entity.Reservation;
import ims.orariaperti.repository.ReservationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservation")
@Controller
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public Object getReservations(@RequestHeader(required = false) UUID publicKey, @RequestHeader(required = false) UUID privateKey) {
        if (publicKey == null && privateKey == null) {
            return ResponseEntity.badRequest().build();
        }
        if (privateKey != null) {
            Optional<Object> reservationInDB = reservationRepository.findByPrivateKey(privateKey);
            if (reservationInDB.isPresent() && reservationInDB.get() instanceof Reservation reservation) {
                return ResponseEntity.ok(new Object() {
                    public final Reservation reservationDetails = reservation;
                    public final UUID privateKey = reservation.getPrivateKey();
                    public final UUID publicKey = reservation.getPublicKey();
                });
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            Optional<Object> reservationInDB = reservationRepository.findByPublicKey(publicKey);
            if (reservationInDB.isPresent() && reservationInDB.get() instanceof Reservation reservation) {
                return ResponseEntity.ok(new Object() {
                    public final Reservation reservationDetails = reservation;
                    public final UUID publicKey = reservation.getPublicKey();
                });
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    }

    @PostMapping
    public ResponseEntity<Object> createReservation(@RequestBody ReservationDTO reservationDTO) {
        try {
            if (!reservationDTO.getParticipants().matches("^[A-Za-z]+(,[A-Za-z]+)*$")) {
                throw new Exception("Participants field must only contain letters (A-Z, a-z) separated by commas.");
            }

            for (Reservation reservation : reservationRepository.findAll()) {
                boolean isSameRoom = reservation.getRoom() == reservationDTO.getRoom();
                boolean isSameDate = reservation.getDate().equals(reservationDTO.getDate());
                boolean isOverlappingTime = reservationDTO.getStartTime().isBefore(reservation.getEndTime()) && reservationDTO.getEndTime().isAfter(reservation.getStartTime());

                if (isSameRoom && isSameDate && isOverlappingTime) {
                    throw new Exception("Room is already reserved for the given time and the given date.");
                }
            }
            Reservation reservationInDB = new Reservation(null, reservationDTO.getDate(), reservationDTO.getStartTime(), reservationDTO.getEndTime(), reservationDTO.getRoom(), reservationDTO.getDescription(), reservationDTO.getParticipants(), null, null);
            reservationRepository.save(reservationInDB);
            return ResponseEntity.ok(new Object() {
                public final Reservation reservation = reservationInDB;
                public final UUID privateKey = reservationInDB.getPrivateKey();
                public final UUID publicKey = reservationInDB.getPublicKey();
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable UUID id, @RequestBody UUID privateKey) {
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
    public ResponseEntity<Reservation> updateReservation(@PathVariable UUID id, @RequestBody ReservationDTO reservationDTO, @RequestBody UUID privateKey) {
        try {
            Reservation reservation = reservationRepository.getFirstById(id);
            if (reservation == null) {
                return ResponseEntity.notFound().build();
            }
            if (!reservation.getPrivateKey().equals(privateKey)) {
                return ResponseEntity.status(401).build();
            }

            if (!reservationDTO.getParticipants().matches("^[A-Za-z]+(,[A-Za-z]+)*$")) {
                throw new Exception("Participants field must only contain letters (A-Z, a-z) separated by commas.");
            }

            for (Reservation currentReservationFromDB : reservationRepository.findAll()) {
                boolean isSameRoom = currentReservationFromDB.getRoom() == reservationDTO.getRoom();
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
                        existingReservation.setRoom(reservationDTO.getRoom());
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