package com.openclassrooms.mddapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.TopicsResponse;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.service.TopicService;

@RestController
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping("/topics")
    public TopicsResponse getTopics() {
        return new TopicsResponse(topicService.getTopics());
    }

    @GetMapping("/topics/{id}")
    public Topic getTopicsById(@PathVariable Long id) {
        Topic findById = topicService.findById(id);
        if (findById != null){
            return findById;
        } else {
            return null;
        }
        
    }
}
