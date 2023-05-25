package com.bezkoder.spring.jwt.mongodb.repository;

import com.bezkoder.spring.jwt.mongodb.models.Entreprise;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EntrepriseRepository extends MongoRepository<Entreprise,String> {
}
