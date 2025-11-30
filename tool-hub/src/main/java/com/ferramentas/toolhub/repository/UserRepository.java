package com.ferramentas.toolhub.repository;

import com.ferramentas.toolhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username = :credential OR u.email = :credential")
    Optional<User> findByUsernameOrEmail(@Param("credential") String credential);

    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    org.springframework.data.domain.Page<User> searchByUsernameOrEmail(@Param("search") String search,
            org.springframework.data.domain.Pageable pageable);
}
