package com.openclassrooms.mddapi.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

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
    public ResponseEntity<?> addUser(@RequestBody RegisterRequest registerRequest, HttpServletResponse response) {
        if (userService.findByEmail(registerRequest.email) != null) {
            return new ResponseEntity<>("Un compte avec le même email existe déjà", HttpStatus.BAD_REQUEST);
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

            // Création du cookie contenant le token
            Cookie cookie = new Cookie("JWT_TOKEN", token);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);
            
            return new ResponseEntity<>(new LoginResponse(user.getId(), user.getUsername(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt()), HttpStatus.CREATED);
        }   
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> getToken(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        User user = userService.findByEmail(loginRequest.email);
        if (user != null && bCryptPasswordEncoder().matches(loginRequest.password, user.getPassword())) {
            String token = userService.authenticate(new LoginRequest(loginRequest.email, loginRequest.password));

            // Création du cookie
            Cookie cookie = new Cookie("JWT_TOKEN", token);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);

            // Informations supplémentaires sans le token
            return new ResponseEntity<>(new LoginResponse(user.getId(), user.getUsername(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt()), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Email ou mot de passe incorrect", HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/auth/user")
    public ResponseEntity<?> modifyUser(@RequestBody ModifyUserRequest modifyUserRequest) { 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        User existUser = userService.findByEmail(modifyUserRequest.email);
        if (existUser != null && !existUser.getId().equals(currentUser.getId())) {
            return new ResponseEntity<>("Cet email est déjà utilisé", HttpStatus.BAD_REQUEST);
        } else {
            // Récupérez l'utilisateur courant à partir du contexte de sécurité
            currentUser.setEmail(modifyUserRequest.email);
            currentUser.setUsername(modifyUserRequest.username);
            if (!modifyUserRequest.password.isEmpty()) {
                String encodedPassword = bCryptPasswordEncoder().encode(modifyUserRequest.password);
                currentUser.setPassword(encodedPassword);
            }
            this.userService.save(currentUser);
            return new ResponseEntity<>(new CommentResponse("Utilisateur modifié avec succès"), HttpStatus.CREATED);
        }
    }

    @GetMapping("/auth/me")
    public ResponseEntity<?> getMe() { 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return new ResponseEntity<>(new LoginResponse(currentUser.getId(), currentUser.getUsername(), currentUser.getEmail(), currentUser.getCreatedAt(), currentUser.getUpdatedAt()), HttpStatus.CREATED);
    }
}
