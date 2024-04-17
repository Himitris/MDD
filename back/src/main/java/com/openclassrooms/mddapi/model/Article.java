package com.openclassrooms.mddapi.model;

import lombok.*;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;


@Data
@Entity
@Table(name = "ARTICLES")
@NoArgsConstructor
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

    @Column(name = "author_username") 
    private String authorUsername;

    @Column(name = "topic_name") 
    private String topicName;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
