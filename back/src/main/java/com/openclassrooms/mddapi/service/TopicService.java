package com.openclassrooms.mddapi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

@Service
public class TopicService {
    
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public TopicService(TopicRepository topicRepository, UserRepository userRepository) {
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    public Topic findById(Long id) {
        return this.topicRepository.findById(id).orElse(null);
    }

    public Iterable<Topic> getTopics() {
        return this.topicRepository.findAll();
    }
    
    public void subscribe(long topicId, Long currentUserId) throws NotFoundException, BadRequestException {
        Topic topic = this.topicRepository.findById(topicId).orElse(null);
        User user = this.userRepository.findById(currentUserId).orElse(null);
        if (topic == null || user == null) {
            throw new NotFoundException();
        }

        boolean alreadyParticipate = topic.getUsers().stream().anyMatch(o -> o.getId().equals(currentUserId));
        if(alreadyParticipate) {
            throw new BadRequestException();
        }

        topic.getUsers().add(user);

        this.topicRepository.save(topic);
    }

    public void noLongerSubscribe(long topicId, Long currentUserId) throws NotFoundException, BadRequestException {
        Topic topic = this.topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            throw new NotFoundException();
        }

        boolean alreadyParticipate = topic.getUsers().stream().anyMatch(o -> o.getId().equals(currentUserId));
        if(!alreadyParticipate) {
            throw new BadRequestException();
        }
        topic.setUsers(topic.getUsers().stream().filter(user -> !user.getId().equals(currentUserId)).collect(Collectors.toList()));

        this.topicRepository.save(topic);
    }

    public List<Topic> getFollowedTopics(Long currentUserId) {
        return topicRepository.findByUsersId(currentUserId);
    }
}
