package com.openclassrooms.mddapi.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.CommentResponse;
import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.LoginResponse;
import com.openclassrooms.mddapi.dto.ModifyUserRequest;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> addUser(@RequestBody RegisterRequest registerRequest) {
        if (userService.findByEmail(registerRequest.email) != null) {
            return new ResponseEntity<>("User with the same email already exists", HttpStatus.BAD_REQUEST);
        }else {
            User user = new User();
            user.setUsername(registerRequest.username);
            user.setEmail(registerRequest.email);
            // Encodage du mot de passe avec BCryptPasswordEncoder
            String encodedPassword = bCryptPasswordEncoder().encode(registerRequest.password);
            user.setPassword(encodedPassword);  
            LocalDateTime currentDateTime = LocalDateTime.now();
            user.setCreatedAt(currentDateTime);
            user.setUpdatedAt(currentDateTime); 
            userService.save(user);
            String token = userService.authenticate(new LoginRequest(registerRequest.email, registerRequest.password));
            return new ResponseEntity<>(new LoginResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt()), HttpStatus.CREATED);
        }   
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> getToken(@RequestBody LoginRequest loginRequest) { 
        User user = userService.findByEmail(loginRequest.email);
        if (user != null && bCryptPasswordEncoder().matches(loginRequest.password, user.getPassword())) { 
            String token = userService.authenticate(new LoginRequest(loginRequest.email, loginRequest.password));
            return new ResponseEntity<>(new LoginResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt()), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Incorrect email or password", HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/auth/user")
    public ResponseEntity<?> modifyUser(@RequestBody ModifyUserRequest modifyUserRequest) { 
        // Récupérez l'utilisateur courant à partir du contexte de sécurité
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        currentUser.setEmail(modifyUserRequest.getEmail());
        currentUser.setUsername(modifyUserRequest.getUsername());
        this.userService.save(currentUser);
        return new ResponseEntity<>(new CommentResponse("User modified successfully"), HttpStatus.CREATED);
    }
}
