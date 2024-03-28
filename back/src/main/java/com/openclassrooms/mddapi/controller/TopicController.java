package com.openclassrooms.mddapi.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.openclassrooms.mddapi.dto.SubcriptionRequest;
import com.openclassrooms.mddapi.dto.TopicResponse;
import com.openclassrooms.mddapi.dto.CommentResponse;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.TopicService;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping("")
    public Iterable<Topic> getTopics() {
        return topicService.getTopics();
    }

    @GetMapping("/{id}")
    public Topic getTopicsById(@PathVariable Long id) {
        Topic findById = topicService.findById(id);
        if (findById != null){
            return findById;
        } else {
            return null;
        }
    }

    @PostMapping("/participate")
    public ResponseEntity<?> subscribe(@RequestBody SubcriptionRequest topic) throws BadRequestException, NotFoundException {
        try {
            // Récupérez l'utilisateur courant à partir du contexte de sécurité
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            Long currentUserId = currentUser.getId();
            this.topicService.subscribe(Long.parseLong(topic.topic), currentUserId);

            return new ResponseEntity<>(new CommentResponse("Successfull subscribe !"), HttpStatus.CREATED);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{topicId}/participate")
    public ResponseEntity<?> noLongerSubscribe(@PathVariable Long topicId) throws BadRequestException, NotFoundException {
        try {
            // Récupérez l'utilisateur courant à partir du contexte de sécurité
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            Long currentUserId = currentUser.getId();
            this.topicService.noLongerSubscribe(topicId , currentUserId);

            return new ResponseEntity<>(new CommentResponse("Successfull unsubscribe !"), HttpStatus.CREATED);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{userId}/subscription")
    public List<TopicResponse> subscription(@PathVariable Long userId)  {
        List<Topic> followedTopics = topicService.getFollowedTopics(userId);
        List<TopicResponse> topicResponses = new ArrayList<>();
        if (followedTopics != null) {
            for (Topic topic : followedTopics) {
                TopicResponse topicResponse = new TopicResponse();
                topicResponse.setId(topic.getId());
                topicResponse.setTitle(topic.getTitle());
                topicResponse.setDescription(topic.getDescription());
                topicResponses.add(topicResponse);
            }
        }
        return topicResponses;
    }
}
