package com.bezkoder.spring.jwt.mongodb.service;

import com.bezkoder.spring.jwt.mongodb.models.Pointage;
import com.bezkoder.spring.jwt.mongodb.repository.PointageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PointageService {
    @Autowired
    private PointageRepository repository;

    //CRUD  CREATE , READ , UPDATE , DELETE


    public Pointage addPointage(Pointage pointage) {
        pointage.setPointageId(UUID.randomUUID().toString().split("-")[0]);
        return repository.save(pointage);
    }

    public List<Pointage> findAllPointages() {
        return repository.findAll();
    }

    public Pointage getTaskByPointageId(String pointageId){
        return repository.findById(pointageId).get();
    }
    public Pointage updatePointage(Pointage pointageRequest){
        //get the existing document from DB
        // populate new value from request to existing object/entity/document
        Pointage existingPointage = repository.findById(pointageRequest.getPointageId()).get();
        existingPointage.setType(pointageRequest.getType());
        existingPointage.setLocalisation(pointageRequest.getLocalisation());
        existingPointage.setDate(pointageRequest.getDate());
        existingPointage.setUser(pointageRequest.getUser());
        existingPointage.setSite(pointageRequest.getSite());
        return repository.save(existingPointage);
    }

    public String deletePointage(String pointageId){
        repository.deleteById(pointageId);
        return pointageId+" task deleted from dashboard ";
    }
}
