package com.openclassrooms.mddapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.model.Article;
import com.openclassrooms.mddapi.repository.ArticleRepository;

@Service
public class ArticleService {
    
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Article findById(Long id) {
        return this.articleRepository.findById(id).orElse(null);
    }

    public void save(Article article) {
        this.articleRepository.save(article);
    }
}
