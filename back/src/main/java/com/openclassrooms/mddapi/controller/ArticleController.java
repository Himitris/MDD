package com.openclassrooms.mddapi.controller;

import java.time.LocalDateTime;
import java.util.List;

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
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.ArticleService;

@RestController
@RequestMapping("/api")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @PostMapping("/article")
    public ResponseEntity<?> addArticle(@RequestBody ArticleRequest articleRequest) { 
        Article article = new Article();
        article.setTitle(articleRequest.title);
        article.setContent(articleRequest.content);
        // Récupérez l'utilisateur courant à partir du contexte de sécurité
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Long currentUserId = currentUser.getId();

        LocalDateTime currentDateTime = LocalDateTime.now();
        article.setCreatedAt(currentDateTime);
        article.setUpdatedAt(currentDateTime); 
        article.setTopicId(articleRequest.topic);
        article.setUserId(currentUserId);
        articleService.save(article);
        return new ResponseEntity<>(new CommentResponse("Article posted !"), HttpStatus.CREATED);
    }

    @GetMapping("/article")
    public ResponseEntity<List<Article>> getArticles() { 
        return new ResponseEntity<>(articleService.findAll(), HttpStatus.CREATED);
    }

    @GetMapping("/article/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable("id") Long id) { 
        return new ResponseEntity<>(articleService.findById(id), HttpStatus.CREATED);
    }
}
