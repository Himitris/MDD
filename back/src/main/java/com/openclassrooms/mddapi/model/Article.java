package com.openclassrooms.mddapi.model;

import lombok.*;

import java.time.LocalDateTime;

import javax.persistence.*;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

@Data
@Entity
@Table(name = "ARTICLE")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String title;

    @NonNull
    private String content;
    
    @Column(name = "author_id")
    private Long userId;
    
    @Column(name = "topic_id") 
    private Long topicId;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
