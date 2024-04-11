package com.example.photoserver.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;

import com.example.photoserver.dto.request.ConfirmRequest;
import com.example.photoserver.dto.request.LoginRequest;
import com.example.photoserver.dto.request.RegisterRequest;
import com.example.photoserver.dto.response.MainDTO;
import com.example.photoserver.dto.response.ConfirmResponse;
import com.example.photoserver.dto.response.LoginResponse;
import com.example.photoserver.dto.response.RegisterResponse;
import com.example.photoserver.entity.User;
import com.example.photoserver.repository.UserRepository;
import com.example.photoserver.security.jwt.JwtUtils;
import com.example.photoserver.security.services.UserDetailsImpl;

import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Validated @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new LoginResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Validated @RequestBody RegisterRequest registerRequest) {
        if (registerRequest.getUsername().isBlank() ||
                registerRequest.getEmail().isBlank() ||
                registerRequest.getPassword().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(MainDTO.object(HttpStatus.BAD_REQUEST, "Data is not valid!"));
        }

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(MainDTO.object(HttpStatus.BAD_REQUEST, "Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(MainDTO.object(HttpStatus.BAD_REQUEST, "Email is already in use!"));
        }

        // Create new user's account
        User user = new User(registerRequest.getUsername(),
                registerRequest.getEmail(),
                encoder.encode(registerRequest.getPassword()));

        userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(user);

        return ResponseEntity.ok(new RegisterResponse(jwt));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmUser(@Validated @RequestBody ConfirmRequest confirmRequest) {
        String jwt = confirmRequest.getToken();
        if (jwt == null || jwt.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(MainDTO.object(HttpStatus.BAD_REQUEST, "No token!"));
        }

        if (!jwtUtils.validateJwtToken(jwt)) {
            return ResponseEntity
                    .badRequest()
                    .body(MainDTO.object(HttpStatus.BAD_REQUEST, "Token is invalid"));
        }

        String username = jwtUtils.getUserNameFromJwtToken(jwt);
        Optional<User> userMaybe = userRepository.findByUsername(username);
        if (userMaybe.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(MainDTO.object(HttpStatus.BAD_REQUEST, "User not found"));
        }

        User user = userMaybe.get();
        user.setConfirmed(true);
        userRepository.save(user);
        return ResponseEntity
                .ok(new ConfirmResponse("User was confirmed successfully"));
    }
}