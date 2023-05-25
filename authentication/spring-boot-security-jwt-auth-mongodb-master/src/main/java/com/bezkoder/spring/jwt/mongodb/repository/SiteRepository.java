package com.bezkoder.spring.jwt.mongodb.repository;

import com.bezkoder.spring.jwt.mongodb.models.Site;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SiteRepository extends MongoRepository<Site,String>{
    boolean existsByLocalisation(String localisation);
}
