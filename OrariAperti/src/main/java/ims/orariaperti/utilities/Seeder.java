package ims.orariaperti.utilities;

import ims.orariaperti.entity.Reservation;
import ims.orariaperti.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Component
public class Seeder implements CommandLineRunner {

    private final ReservationRepository reservationRepository;

    @Autowired
    public Seeder(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public void run(String... args) {

        // Save reservations
        if (reservationRepository.count() == 0) {
            reservationRepository.save(new Reservation(
                    null,
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