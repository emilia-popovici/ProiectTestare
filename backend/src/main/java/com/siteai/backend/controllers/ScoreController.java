package com.siteai.backend.controllers;

import com.siteai.backend.models.Score;
import com.siteai.backend.models.User;
import com.siteai.backend.repositories.ScoreRepository;
import com.siteai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Vom folosi un Map pentru a primi JSON-ul simplu

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScoreController {

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private UserRepository userRepository;

    // GET /api/scores - CERUT DE profil.js
    @GetMapping("/scores")
    public ResponseEntity<List<Score>> getScores(Authentication authentication) {
        // Obține email-ul utilizatorului din token-ul de securitate
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Caută scorurile doar pentru acel utilizator
        List<Score> scores = scoreRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(scores);
    }

    // POST /api/scores - CERUT DE joc.js
    @PostMapping("/scores")
    public ResponseEntity<?> saveScore(@RequestBody Map<String, Integer> payload, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        int scoreValue = payload.get("score");
        int totalValue = payload.get("total");

        Score newScore = new Score(user, scoreValue, totalValue);
        scoreRepository.save(newScore);

        return ResponseEntity.ok(Map.of("msg", "Scor salvat!"));
    }
}