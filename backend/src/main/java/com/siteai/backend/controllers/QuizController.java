package com.siteai.backend.controllers;

import com.siteai.backend.models.QuizQuestion;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class QuizController {

    @GetMapping("/quiz/questions")
    public List<QuizQuestion> getQuestions() {
        return List.of(
            new QuizQuestion("videos/real1.mp4", "Real"),
            new QuizQuestion("videos/ai1.MP4", "AI"),
            new QuizQuestion("videos/ai2.mp4", "AI"),
            new QuizQuestion("videos/real2.MP4", "Real"),
            new QuizQuestion("videos/ai3.mp4", "AI"),
            new QuizQuestion("videos/ai4.mp4", "AI")
        );
    }
}