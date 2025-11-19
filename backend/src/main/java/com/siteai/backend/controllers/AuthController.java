package com.siteai.backend.controllers;

import com.siteai.backend.models.User;
import com.siteai.backend.payload.AuthRequest;
import com.siteai.backend.payload.AuthResponse;
import com.siteai.backend.payload.MessageResponse;
import com.siteai.backend.repositories.ScoreRepository;
import com.siteai.backend.repositories.UserRepository;
import com.siteai.backend.security.jwt.JwtUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ScoreRepository scoreRepository; // Injectam repository-ul de scoruri

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        String loginInput = authRequest.email(); 
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginInput, authRequest.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByUsernameOrEmail(loginInput, loginInput)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getUsername()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest authRequest) {
        if (userRepository.existsByEmail(authRequest.email())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Eroare: Email-ul este deja folosit!"));
        }

        String usernameToSave = authRequest.username();
        if (usernameToSave == null || usernameToSave.trim().isEmpty()) {
             usernameToSave = authRequest.email().split("@")[0];
        }

        if (userRepository.existsByUsername(usernameToSave)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Eroare: Numele de utilizator este luat!"));
        }

        String encodedPassword = passwordEncoder.encode(authRequest.password());
        User user = new User(authRequest.email(), encodedPassword, usernameToSave);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Utilizator inregistrat cu succes!"));
    }

    // --- FUNCTIA NOUA DE STERGERE CONT ---
    @DeleteMapping("/delete")
    @Transactional // Asigura ca se sterg ambele (scoruri + user) sau nimic
    public ResponseEntity<?> deleteUser(Authentication authentication) {
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Mai intai stergem scorurile utilizatorului (ca sa nu avem erori de legatura)
        scoreRepository.deleteByUser(user);

        // 2. Apoi stergem utilizatorul
        userRepository.delete(user);

        return ResponseEntity.ok(new MessageResponse("Cont sters cu succes."));
    }
}