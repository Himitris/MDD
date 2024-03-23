package com.openclassrooms.mddapi.controller;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.LoginResponse;
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
            LoginResponse response = new LoginResponse(userService.authenticate(new LoginRequest(registerRequest.email, registerRequest.password)));

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }   
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> getToken(@RequestBody LoginRequest loginRequest) { 
        User user = userService.findByEmail(loginRequest.email);
        if (user != null && bCryptPasswordEncoder().matches(loginRequest.password, user.getPassword())) { 
            return new ResponseEntity<>(new LoginResponse(userService.authenticate(new LoginRequest(loginRequest.email, loginRequest.password))), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Incorrect email or password", HttpStatus.UNAUTHORIZED);
        }
    }
}
