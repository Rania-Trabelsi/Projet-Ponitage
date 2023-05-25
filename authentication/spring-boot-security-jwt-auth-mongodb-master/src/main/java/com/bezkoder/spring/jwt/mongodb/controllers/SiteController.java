package com.bezkoder.spring.jwt.mongodb.controllers;

import com.bezkoder.spring.jwt.mongodb.models.Site;
import com.bezkoder.spring.jwt.mongodb.models.User;
import com.bezkoder.spring.jwt.mongodb.repository.SiteRepository;
import com.bezkoder.spring.jwt.mongodb.service.SiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sites")
public class SiteController {
    @Autowired
    private SiteService service;

    @Autowired
    private SiteRepository repo;
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createSite(@RequestBody Site site) {
        if (repo.existsByLocalisation(site.getLocalisation())) {
            String message = "Site with the given location already exists";
            return ResponseEntity.badRequest().body(message);
        }
        Site createdSite = service.addSite(site);
        return ResponseEntity.ok(createdSite);
    }

    @GetMapping
    public List<Site> getSites() {
        return service.findAllSites();
    }

    @GetMapping("/{siteId}")
    public Site getSite(@PathVariable String siteId){
        return service.getSiteById(siteId);
    }

    @PutMapping
    public Site modifySite(@RequestBody Site site){
        return service.updateSite(site);
    }

    @DeleteMapping("/{siteId}")
    public String deleteSite(@PathVariable String siteId){
        return service.deleteSite(siteId);
    }

    @PostMapping("/{siteId}/users")
    public User addUserToSite(@PathVariable String siteId, @RequestBody User user) {
        return service.addUserToSite(siteId, user);
    }
}
