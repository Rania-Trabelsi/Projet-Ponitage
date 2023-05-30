package com.bezkoder.spring.jwt.mongodb.controllers;

import com.bezkoder.spring.jwt.mongodb.models.User;
import com.bezkoder.spring.jwt.mongodb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping
    public List<User> getUsers() {
        return service.findAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id){
        return service.getTaskByUserId(id);
    }

    @PutMapping("/{userId}")
    public User modifyTask(@PathVariable String userId,@RequestBody User user){
        return service.updateUser(userId,user);
    }

    //@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable String id){
        return service.deleteUser(id);
    }

    @PutMapping("/{userId}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable String userId,
                                                 @RequestBody String newPassword) {
        boolean passwordChanged = service.resetPassword(userId, newPassword);

        if (passwordChanged) {
            return ResponseEntity.ok(newPassword);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to change the password.");
        }
    }

}
