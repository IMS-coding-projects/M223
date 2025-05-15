package ims.orariaperti.utilities;

import ims.orariaperti.entity.Reservation;
import ims.orariaperti.entity.User;
import ims.orariaperti.model.Roles;
import ims.orariaperti.repository.ReservationRepository;
import ims.orariaperti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Component
public class Seeder implements CommandLineRunner {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    @Autowired
    public Seeder(ReservationRepository reservationRepository, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        // Retrieve existing users from the database
        User admin = userRepository.findByUsername("admin")
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        User user1 = userRepository.findByUsername("user1")
                .orElseThrow(() -> new RuntimeException("User1 not found"));
        User user2 = userRepository.findByUsername("user2")
                .orElseThrow(() -> new RuntimeException("User2 not found"));

        // Save reservations
        if (reservationRepository.count() == 0) {
            reservationRepository.save(new Reservation(
                    null,
                    admin, // Use managed admin
                    LocalDate.now(),
                    LocalTime.of(9, 0),
                    LocalTime.of(10, 0),
                    101,
                    "Team Meeting",
                    "Chandra,Johnson",
                    UUID.randomUUID(),
                    UUID.randomUUID()
            ));
            reservationRepository.save(new Reservation(
                    null,
                    user1, // Use managed user1
                    LocalDate.now(),
                    LocalTime.of(11, 0),
                    LocalTime.of(12, 0),
                    102,
                    "Project Discussion",
                    "Natalia,Fluury",
                    UUID.randomUUID(),
                    UUID.randomUUID()
            ));

            System.out.println("Sample Reservations have been added to the database.");
        }
    }
}