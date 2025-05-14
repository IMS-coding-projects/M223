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
        // Check if the database is empty
        if (reservationRepository.count() == 0) {
            reservationRepository.save(new Reservation(null, LocalDate.now(), LocalTime.of(9, 0), LocalTime.of(10, 0), 101, "Team Meeting", "Chandra,Johnson"));
            reservationRepository.save(new Reservation(null, LocalDate.now(), LocalTime.of(11, 0), LocalTime.of(12, 0), 102, "Project Discussion", "Natalia,Fluury"));

            System.out.println("Sample Reservations have been added to the database.");
        }

        if (userRepository.count() == 0) {
            userRepository.save(new User(null, "admin", Roles.ADMIN));
            userRepository.save(new User(null, "user1", Roles.USER));
            userRepository.save(new User(null, "user2", Roles.USER));

            System.out.println("Sample Users have been added to the database.");
        }
    }
}