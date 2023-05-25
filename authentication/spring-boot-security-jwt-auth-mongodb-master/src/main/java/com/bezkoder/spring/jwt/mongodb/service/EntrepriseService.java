package com.bezkoder.spring.jwt.mongodb.service;

import com.bezkoder.spring.jwt.mongodb.models.Entreprise;
import com.bezkoder.spring.jwt.mongodb.models.Site;
import com.bezkoder.spring.jwt.mongodb.repository.EntrepriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EntrepriseService {

    @Autowired
    private EntrepriseRepository repository;

    // CRUD operations: CREATE, READ, UPDATE, DELETE

    public Entreprise addEntreprise(Entreprise entreprise) {
        entreprise.setEntrepriseId(UUID.randomUUID().toString().split("-")[0]);
        return repository.save(entreprise);
    }

    public List<Entreprise> findAllEntreprises() {
        return repository.findAll();
    }

    public Entreprise getEntrepriseByEntrepriseId(String entrepriseId) {
        return repository.findById(entrepriseId).orElse(null);
    }

    public Entreprise updateEntreprise(Entreprise entrepriseRequest) {
        // get the existing document from DB
        // populate new value from request to existing object/entity/document
        Entreprise existingEntreprise = repository.findById(entrepriseRequest.getEntrepriseId()).orElse(null);
        if (existingEntreprise != null) {
            existingEntreprise.setSites(entrepriseRequest.getSites());
            existingEntreprise.setEntrepriseName(entrepriseRequest.getEntrepriseName());
            return repository.save(existingEntreprise);
        }
        return null;
    }

    public String deleteEntreprise(String entrepriseId) {
        repository.deleteById(entrepriseId);
        return entrepriseId + " task deleted from dashboard";
    }

    public Entreprise addSiteToEntreprise(String entrepriseId, String siteId) {
        Entreprise entreprise = getEntrepriseByEntrepriseId(entrepriseId);
        if (entreprise == null) {
            return null;
        }
        entreprise.addSite(siteId);
        return repository.save(entreprise);
    }
}