package com.siteai.backend.repositories;

import com.siteai.backend.models.Score;
import com.siteai.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByUserOrderByCreatedAtDesc(User user);
    
    // Functia pentru stergere
    void deleteByUser(User user);
}