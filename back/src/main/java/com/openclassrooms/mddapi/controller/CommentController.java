package com.openclassrooms.mddapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.CommentRequest;
import com.openclassrooms.mddapi.dto.CommentResponse;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.CommentService;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @PostMapping("{id}/comment")
    public ResponseEntity<?> addComment(@RequestBody CommentRequest commentRequest, @PathVariable Long id) { 
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Comment comment = Comment.builder().content(commentRequest.content).articleId(id).userId(currentUser.getId()).authorUsername(currentUser.getUsername()).build();
        commentService.save(comment);
        return new ResponseEntity<>(new CommentResponse("Comment posté !"), HttpStatus.CREATED);
    }

    @GetMapping("{id}/comment")
    public Iterable<Comment> getComments( @PathVariable Long id) { 
        return commentService.findByArticleId(id);
    }

}
