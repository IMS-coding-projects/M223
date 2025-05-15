package ims.orariaperti.repository;

import ims.orariaperti.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    User getUsersById(UUID id);

    User getFirstById(UUID id);
}