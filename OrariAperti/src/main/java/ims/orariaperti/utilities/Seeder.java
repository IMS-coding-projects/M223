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
import java.util.Optional;
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
        User admin;
        if (userRepository.findByUsername("admin").isEmpty()) {
            admin = new User(null, "admin", Roles.ADMIN);
            userRepository.save(admin);
        } else {
            admin = userRepository.findByUsername("admin").orElse(null);
        }

        User user1;
        if (userRepository.findByUsername("user1").isEmpty()) {
            user1 = new User(null, "user1", Roles.USER);
            userRepository.save(user1);
        } else {
            user1 = userRepository.findByUsername("user1").orElse(null);
        }

        // Save reservations
        if (reservationRepository.count() == 0) {
            reservationRepository.save(new Reservation(
                    null,
                    admin,
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
                    user1,
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