package com.openclassrooms.mddapi.model;

import lombok.*;

import jakarta.persistence.*;


@Data
@Entity
@Table(name = "COMMENT")
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Column(name = "author_id")
    private Long userId;
    
    @Column(name = "article_id")
    private Long articleId;

    @NonNull
    private String content;

}
