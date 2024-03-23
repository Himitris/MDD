package com.openclassrooms.mddapi.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleRequest {
    public String title;
    public String content;
    public Long topic;
}
