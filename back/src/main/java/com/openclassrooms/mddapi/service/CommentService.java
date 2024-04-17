package com.openclassrooms.mddapi.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.repository.CommentRepository;

@Service
public class CommentService {
    
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment findById(Long id) {
        return this.commentRepository.findById(id).orElse(null);
    }

    public void save(Comment comment) {
        this.commentRepository.save(comment);
    }

    public Iterable<Comment> findByArticleId(Long id) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        return commentRepository.findByArticleId(id, sort);
    }
}
