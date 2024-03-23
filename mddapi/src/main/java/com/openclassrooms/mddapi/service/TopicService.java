package com.openclassrooms.mddapi.service;

import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.repository.TopicRepository;

@Service
public class TopicService {
    
    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    public Topic findById(Long id) {
        return this.topicRepository.findById(id).orElse(null);
    }

    public Iterable<Topic> getTopics() {
        return this.topicRepository.findAll();
    }
}
