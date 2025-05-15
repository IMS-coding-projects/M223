package ims.orariaperti.controller;

import ims.orariaperti.entity.Reservation;
import ims.orariaperti.entity.User;
import ims.orariaperti.model.DTO.ReservationDTO;
import ims.orariaperti.repository.ReservationRepository;
import ims.orariaperti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.engine.TemplateHandlerAdapterTextHandler;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservation")
@Controller
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public ReservationController(ReservationRepository reservationRepository, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable UUID id) {
        try {
            return reservationRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Object> createReservation(@RequestBody ReservationDTO reservationDTO) {
        try {
            User user = userRepository.getFirstById((reservationDTO.getUserId()));
            if (user == null) {
                throw new Exception("User with given ID not found");
            }

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
            Reservation reservation = new Reservation(null, user, reservationDTO.getDate(), reservationDTO.getStartTime(), reservationDTO.getEndTime(), reservationDTO.getRoom(), reservationDTO.getDescription(), reservationDTO.getParticipants(), null, null);
            reservationRepository.save(reservation);
            return ResponseEntity.ok(new Object() {
                public final Reservation createdReservation = reservation;
                public final UUID privateKey = reservation.getPrivateKey();
                public final UUID publicKey = reservation.getPublicKey();
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

            User user = userRepository.getFirstById((reservationDTO.getUserId()));
            if (user == null) {
                throw new Exception("User with given ID not found");
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
                        existingReservation.setUser(user);
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