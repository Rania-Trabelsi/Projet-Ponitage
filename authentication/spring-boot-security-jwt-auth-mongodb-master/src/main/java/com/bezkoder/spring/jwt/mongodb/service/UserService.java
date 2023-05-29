package com.bezkoder.spring.jwt.mongodb.service;

import com.bezkoder.spring.jwt.mongodb.models.Role;
import com.bezkoder.spring.jwt.mongodb.models.User;
import com.bezkoder.spring.jwt.mongodb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //CRUD  CREATE , READ , UPDATE , DELETE

    public List<User> findAllUsers() {
        return repository.findAll();
    }

    public User getTaskByUserId(String userId){
        return repository.findById(userId).get();
    }
    public User updateUser(User userRequest) {
        User existingUser = repository.findById(userRequest.getId()).orElse(null);
        if (existingUser == null) {
            throw new RuntimeException("User not found");
        }

        // update basic user fields
        existingUser.setUsername(userRequest.getUsername());
        existingUser.setEmail(userRequest.getEmail());

        // Update password if provided
        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            // Hash the new password
            String hashedPassword = passwordEncoder.encode(userRequest.getPassword());
            existingUser.setPassword(hashedPassword);
        }
        existingUser.setSite(userRequest.getSite());
        existingUser.setEntreprise(userRequest.getEntreprise());



        // update roles separately
        Set<Role> newRoles = userRequest.getRoles();
        if (newRoles != null && !newRoles.isEmpty()) {
            existingUser.getRoles().clear();
            existingUser.getRoles().addAll(newRoles);
        }

        System.out.println("Request roles: " + userRequest.getRoles());
        System.out.println("Existing user roles: " + existingUser.getRoles());

        return repository.save(existingUser);
    }


    public String deleteUser(String userId){
        repository.deleteById(userId);
        return userId+" task deleted from dashboard ";
    }
    public boolean resetPassword(String userId, String newPassword) {
        User user = repository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Update password
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        repository.save(user);
        return true;
    }
}
