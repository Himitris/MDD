package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.model.Comment;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository  extends JpaRepository<Comment, Long>{
    Iterable<Comment> findByArticleId(Long articleId, Sort sort);
}
