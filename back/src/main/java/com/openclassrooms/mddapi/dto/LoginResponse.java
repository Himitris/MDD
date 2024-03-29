package com.openclassrooms.mddapi.dto;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    public String token;
    public Long id;
    public String username;
    public String email;
    public LocalDateTime created_at;
    public LocalDateTime updates_at;
}