package com.bezkoder.spring.jwt.mongodb.service;

import com.bezkoder.spring.jwt.mongodb.models.Site;
import com.bezkoder.spring.jwt.mongodb.models.User;
import com.bezkoder.spring.jwt.mongodb.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class SiteService {
    @Autowired
    private SiteRepository repository;

    //CRUD  CREATE , READ , UPDATE , DELETE

    public Site addSite(Site site) {
        if (repository.existsByLocalisation(site.getLocalisation())) {
            throw new IllegalArgumentException("Site with the given localisation already exists");
        }

        site.setSiteId(UUID.randomUUID().toString().split("-")[0]);
        return repository.save(site);
    }

    public List<Site> findAllSites() {
        return repository.findAll();
    }

    public Site getSiteById(String siteId){
        Optional<Site> site = repository.findById(siteId);
        if (site.isPresent()) {
            return site.get();
        } else {
            throw new RuntimeException("Site not found with id: " + siteId);
        }
    }

    public Site updateSite(Site siteRequest){
        //get the existing document from DB
        // populate new value from request to existing object/entity/document
        Site existingSite = getSiteById(siteRequest.getSiteId());
        existingSite.setLocalisation(siteRequest.getLocalisation());
        existingSite.setUsers(new HashSet<>(siteRequest.getUsers()));
        existingSite.setName(siteRequest.getName());
        return repository.save(existingSite);
    }

    public String deleteSite(String siteId){
        repository.deleteById(siteId);
        return siteId+" task deleted from dashboard ";
    }

    public User addUserToSite(String siteId, User user) {
        Site site = getSiteById(siteId);
        Set<User> users = site.getUsers();
        users.add(user);
        site.setUsers(users);
        repository.save(site);
        return user;
    }
}
