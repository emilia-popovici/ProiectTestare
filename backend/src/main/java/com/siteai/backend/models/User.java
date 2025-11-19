package com.siteai.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    // Cheia principala, se autogenereaza (1, 2, 3...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Email-ul trebuie sa fie unic, nu pot fi doi useri cu acelasi mail
    @Column(unique = true)
    private String email;
    private String password;
    private String username;

    // Constructor gol pt Hibernate
    public User() {
    }

    // Constructorul pt un cont nou
    public User(String email, String password, String username) {
        this.email = email;
        this.password = password;
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}