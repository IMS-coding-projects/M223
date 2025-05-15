package ims.orariaperti.controller;

import ims.orariaperti.entity.Reservation;
import ims.orariaperti.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("reservation", new Reservation());
        return "createReservation";
    }

    @PostMapping("/create")
    public String createReservation(@ModelAttribute Reservation reservation, Model model) {
        // Validate reservation
        if (reservation.getDate().isBefore(LocalDate.now()) ||
                reservation.getStartTime().isAfter(reservation.getEndTime())) {
            model.addAttribute("error", "Invalid date or time range.");
            return "createReservation";
        }

        // Check room availability
        List<Reservation> existingReservations = reservationRepository.findAll();
        for (Reservation existing : existingReservations) {
            if (existing.getRoom() == reservation.getRoom() &&
                    existing.getDate().equals(reservation.getDate()) &&
                    (reservation.getStartTime().isBefore(existing.getEndTime()) &&
                            reservation.getEndTime().isAfter(existing.getStartTime()))) {
                model.addAttribute("error", "Room is already reserved for the selected time.");
                return "createReservation";
            }
        }

        // Save reservation
        reservation.setId(UUID.randomUUID());
        reservationRepository.save(reservation);
        model.addAttribute("success", "Reservation created successfully!");
        return "confirmation";
    }

    @GetMapping("/{publicKey}")
    public String viewReservation(@PathVariable UUID publicKey, Model model) {
        Optional<Reservation> reservation = reservationRepository.findById(publicKey);
        if (reservation.isPresent()) {
            model.addAttribute("reservation", reservation.get());
            return "viewReservation";
        } else {
            model.addAttribute("error", "Reservation not found.");
            return "error";
        }
    }

    @GetMapping("/{privateKey}/edit")
    public String editReservation(@PathVariable UUID privateKey, Model model) {
        Optional<Reservation> reservation = reservationRepository.findById(privateKey);
        if (reservation.isPresent()) {
            model.addAttribute("reservation", reservation.get());
            return "editReservation";
        } else {
            model.addAttribute("error", "Reservation not found.");
            return "error";
        }
    }

    @PostMapping("/{privateKey}/edit")
    public String updateReservation(@PathVariable UUID privateKey, @ModelAttribute Reservation updatedReservation, Model model) {
        Optional<Reservation> reservation = reservationRepository.findById(privateKey);
        if (reservation.isPresent()) {
            Reservation existingReservation = reservation.get();
            existingReservation.setDate(updatedReservation.getDate());
            existingReservation.setStartTime(updatedReservation.getStartTime());
            existingReservation.setEndTime(updatedReservation.getEndTime());
            existingReservation.setRoom(updatedReservation.getRoom());
            existingReservation.setDescription(updatedReservation.getDescription());
            existingReservation.setParticipants(updatedReservation.getParticipants());
            reservationRepository.save(existingReservation);
            model.addAttribute("success", "Reservation updated successfully!");
            return "confirmation";
        } else {
            model.addAttribute("error", "Reservation not found.");
            return "error";
        }
    }

    @PostMapping("/{privateKey}/delete")
    public String deleteReservation(@PathVariable UUID privateKey, Model model) {
        if (reservationRepository.existsById(privateKey)) {
            reservationRepository.deleteById(privateKey);
            model.addAttribute("success", "Reservation deleted successfully!");
            return "confirmation";
        } else {
            model.addAttribute("error", "Reservation not found.");
            return "error";
        }
    }
}