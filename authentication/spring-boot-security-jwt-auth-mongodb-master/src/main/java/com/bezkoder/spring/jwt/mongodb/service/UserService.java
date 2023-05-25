package com.bezkoder.spring.jwt.mongodb.service;

import com.bezkoder.spring.jwt.mongodb.models.Role;
import com.bezkoder.spring.jwt.mongodb.models.User;
import com.bezkoder.spring.jwt.mongodb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    private UserRepository repository;

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
        existingUser.setPassword(userRequest.getPassword());
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
}
