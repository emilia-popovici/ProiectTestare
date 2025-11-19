package com.siteai.backend.repositories;

import com.siteai.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Aceasta este o interfață, nu o clasă.
// Spring o va implementa automat pentru noi!
public interface UserRepository extends JpaRepository<User, Long> {

    // Găsește un utilizator după email (folosit la login)
    Optional<User> findByEmail(String email);

    // Verifică dacă un email există deja (folosit la înregistrare)
    Boolean existsByEmail(String email);

    // Cauta un user care are username-ul X SAU email-ul X
    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String usernameToSave);
}