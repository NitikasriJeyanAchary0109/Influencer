package com.influenceflow.service;

import com.influenceflow.dto.JwtAuthenticationResponse;
import com.influenceflow.dto.LoginRequest;
import com.influenceflow.dto.RegisterRequest;
import com.influenceflow.entity.Brand;
import com.influenceflow.entity.Role;
import com.influenceflow.entity.User;
import com.influenceflow.repository.BrandRepository;
import com.influenceflow.repository.RoleRepository;
import com.influenceflow.repository.UserRepository;
import com.influenceflow.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    BrandRepository brandRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        return new JwtAuthenticationResponse(jwt);
    }

    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        Role userRole = roleRepository.findByName(registerRequest.getRole() != null ? registerRequest.getRole() : "BRAND_MANAGER")
                .orElseThrow(() -> new RuntimeException("User Role not set."));
        user.setRole(userRole);

        if (registerRequest.getBrandName() != null) {
            Brand brand = new Brand();
            brand.setBrandId(UUID.randomUUID().toString());
            brand.setBrandName(registerRequest.getBrandName());
            brand.setIndustry(registerRequest.getBrandIndustry());
            brand.setIsVerified(false);
            brandRepository.save(brand);
            user.setBrand(brand);
        }

        return userRepository.save(user);
    }

    public java.util.Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }
}
