package com.bezkoder.spring.jwt.mongodb.controllers;
import com.bezkoder.spring.jwt.mongodb.models.Entreprise;
import com.bezkoder.spring.jwt.mongodb.models.Site;
import com.bezkoder.spring.jwt.mongodb.service.EntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entreprise")
public class EntrepriseController {

    @Autowired
    private EntrepriseService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Entreprise CreateEntreprise(@RequestBody Entreprise Entreprise){
        return service.addEntreprise(Entreprise);
    }

    @GetMapping
    public List<Entreprise> getEntreprises() {
        return service.findAllEntreprises();
    }

    @GetMapping("/{entrepriseId}")
    public Entreprise getEntreprise(@PathVariable String entrepriseId){
        return service.getEntrepriseByEntrepriseId(entrepriseId);
    }

    @PutMapping
    public Entreprise modifyTask(@RequestBody Entreprise entreprise){
        return service.updateEntreprise(entreprise);
    }

    @DeleteMapping("/{entrepriseId}")
    public String deleteTask(@PathVariable String entrepriseId){
        return service.deleteEntreprise(entrepriseId);
    }

    @PostMapping("/{entrepriseId}/sites")
    public Entreprise addSite(@PathVariable String entrepriseId, @RequestBody String siteId) {
        return service.addSiteToEntreprise(entrepriseId, siteId);
    }
}
