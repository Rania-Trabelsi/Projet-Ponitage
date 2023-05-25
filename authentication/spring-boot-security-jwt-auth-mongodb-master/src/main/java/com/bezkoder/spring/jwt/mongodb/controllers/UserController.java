package com.bezkoder.spring.jwt.mongodb.controllers;

import com.bezkoder.spring.jwt.mongodb.models.User;
import com.bezkoder.spring.jwt.mongodb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PutMapping
    public User modifyTask(@RequestBody User user){
        return service.updateUser(user);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable String id){
        return service.deleteUser(id);
    }
}
