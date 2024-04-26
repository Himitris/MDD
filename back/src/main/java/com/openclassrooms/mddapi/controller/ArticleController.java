package com.openclassrooms.mddapi.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.ArticleRequest;
import com.openclassrooms.mddapi.dto.CommentResponse;
import com.openclassrooms.mddapi.model.Article;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.ArticleService;
import com.openclassrooms.mddapi.service.TopicService;

@RestController
@RequestMapping("/api/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;
    
    @Autowired
    private TopicService topicService;

    @Autowired
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @PostMapping("")
    public ResponseEntity<?> addArticle(@RequestBody ArticleRequest articleRequest) { 
        Article article = new Article();
        article.setTitle(articleRequest.title);
        article.setContent(articleRequest.content);
        // Récupérez l'utilisateur courant à partir du contexte de sécurité
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        LocalDateTime currentDateTime = LocalDateTime.now();
        article.setCreatedAt(currentDateTime);
        article.setUpdatedAt(currentDateTime); 
        article.setTopicId(articleRequest.topic);
        article.setUserId(currentUser.getId());
        article.setAuthorUsername(currentUser.getUsername());
        article.setTopicName(topicService.findById(articleRequest.topic).getTitle());
        articleService.save(article);
        return new ResponseEntity<>(new CommentResponse("Article posted !"), HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<Article>> getArticles() { 
        return new ResponseEntity<>(articleService.findAll(), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable("id") Long id) { 
        return new ResponseEntity<>(articleService.findById(id), HttpStatus.CREATED);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<Article>> getArticlesForFeed() {
          // Récupérer l'utilisateur courant à partir du contexte de sécurité
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            Long currentUserId = currentUser.getId();

            // Récupérer les topics suivis par l'utilisateur courant
            List<Topic> userTopics = topicService.getFollowedTopics(currentUserId);
            List<Article> allArticles = new ArrayList<>();
            userTopics.forEach(topic -> {
                List<Article> topicArticles = articleService.findByTopicId(topic.getId());
                allArticles.addAll(topicArticles);
            });
            return ResponseEntity.ok(allArticles);
    }
}
