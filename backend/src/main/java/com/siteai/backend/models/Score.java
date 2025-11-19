package com.siteai.backend.models;

import java.time.Instant;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore; // Important!

@Entity
@Table(name = "scores")
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;
    private int total;
    private Instant createdAt;

    @ManyToOne // Multe scoruri aparțin UNUI utilizator
    @JoinColumn(name = "user_id") // Coloana care face legătura
    @JsonIgnore // CRITIC: Previne o buclă infinită când se trimite JSON-ul
    private User user;

    // Constructor, Getters, Setters
    public Score() {
        this.createdAt = Instant.now();
    }

    public Score(User user, int score, int total) {
        this.user = user;
        this.score = score;
        this.total = total;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}