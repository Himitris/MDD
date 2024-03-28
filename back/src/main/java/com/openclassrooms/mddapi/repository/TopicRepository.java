package com.openclassrooms.mddapi.repository;
import com.openclassrooms.mddapi.model.Topic;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository  extends JpaRepository<Topic, Long>{
    List<Topic> findByUsersId(Long currentUserId);
}
