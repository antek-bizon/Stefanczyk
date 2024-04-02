package com.example.photoserver.service;

import com.example.photoserver.entity.User;
import com.example.photoserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.orElse(null);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long userId, User user) {
        if (!userRepository.existsById(userId)) {
            return null; // User not found
        }
        user.setUserId(userId);
        return userRepository.save(user);
    }

    public boolean deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            return false; // User not found
        }
        userRepository.deleteById(userId);
        return true;
    }
}
