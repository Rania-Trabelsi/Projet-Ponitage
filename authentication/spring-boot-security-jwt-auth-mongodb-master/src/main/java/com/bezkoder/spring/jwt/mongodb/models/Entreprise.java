package com.bezkoder.spring.jwt.mongodb.models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "entreprises")
public class Entreprise {
    @Id
    private String entrepriseId;

    private List<String> sites = new ArrayList<>();

    private String entrepriseName;

    public Entreprise() {
    }

    public Entreprise(List<String> sites, String entrepriseName) {
        this.sites = sites;
        this.entrepriseName = entrepriseName;
    }

    public List<String> getSites() {
        return sites;
    }

    public void setSites(List<String> sites) {
        this.sites = sites;
    }

    public String getEntrepriseId() {
        return entrepriseId;
    }

    public void setEntrepriseId(String entrepriseId) {
        this.entrepriseId = entrepriseId;
    }

    public String getEntrepriseName() {
        return entrepriseName;
    }

    public void setEntrepriseName(String entrepriseName) {
        this.entrepriseName = entrepriseName;
    }

    public void addSite(String site) {
        this.sites.add(site);
    }


}
