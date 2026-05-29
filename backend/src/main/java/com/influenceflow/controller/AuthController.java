package com.influenceflow.controller;

import com.influenceflow.dto.JwtAuthenticationResponse;
import com.influenceflow.dto.LoginRequest;
import com.influenceflow.dto.RegisterRequest;
import com.influenceflow.entity.User;
import com.influenceflow.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        JwtAuthenticationResponse jwt = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwt);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        User user = authService.registerUser(registerRequest);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        com.influenceflow.security.UserDetailsImpl userDetails = (com.influenceflow.security.UserDetailsImpl) authentication.getPrincipal();
        return authService.getUserById(userDetails.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
