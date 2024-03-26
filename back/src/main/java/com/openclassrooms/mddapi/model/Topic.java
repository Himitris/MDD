package com.openclassrooms.mddapi.model;

import lombok.*;

import java.util.List;

import jakarta.persistence.*;


@Data
@Entity
@Table(name = "TOPIC")
@NoArgsConstructor
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String title;

    @NonNull
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "SUBSCRIPTION",
            joinColumns = @JoinColumn( name = "topic_id" ),
            inverseJoinColumns = @JoinColumn( name = "user_id" ) )
    private List<User> users;
}
