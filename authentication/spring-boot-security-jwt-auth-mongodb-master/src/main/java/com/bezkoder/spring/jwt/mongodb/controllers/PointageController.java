package com.bezkoder.spring.jwt.mongodb.controllers;

import com.bezkoder.spring.jwt.mongodb.models.Pointage;
import com.bezkoder.spring.jwt.mongodb.service.PointageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pointages")
public class PointageController {

    @Autowired
    private PointageService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pointage CreatePointage(@RequestBody Pointage Pointage){
        return service.addPointage(Pointage);
    }

    @GetMapping
    public List<Pointage> getPointages() {
        return service.findAllPointages();
    }

    @GetMapping("/{pointageId}")
    public Pointage getPointage(@PathVariable String pointageId){
        return service.getTaskByPointageId(pointageId);
    }

    @PutMapping
    public Pointage modifyTask(@RequestBody Pointage pointage){
        return service.updatePointage(pointage);
    }

    @DeleteMapping("/{pointageId}")
    public String deleteTask(@PathVariable String pointageId){
        return service.deletePointage(pointageId);
    }


}
