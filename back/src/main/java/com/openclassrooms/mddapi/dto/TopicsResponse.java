package com.openclassrooms.mddapi.dto;

import java.util.ArrayList;
import java.util.List;

import com.openclassrooms.mddapi.model.Topic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicsResponse {
    
    public List<Topic> rentals;

    public TopicsResponse(Iterable<Topic> topicsIterable) {
        this.rentals = new ArrayList<>();
        topicsIterable.forEach(this.rentals::add);
    }
}