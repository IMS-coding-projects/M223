package ims.orariaperti.repository;

import ims.orariaperti.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    Reservation getFirstById(UUID id);


    Optional<Object> findByPublicKey(UUID publicKey);

    Optional<Object> findByPrivateKey(UUID privateKey);
}
