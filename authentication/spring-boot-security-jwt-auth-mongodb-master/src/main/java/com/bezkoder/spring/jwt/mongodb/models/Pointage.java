package com.bezkoder.spring.jwt.mongodb.models;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "pointages")

public class Pointage {
    @Id
    private String pointageId;
    private String type;

    @DBRef
    private User user ;

    @DBRef
    private Site site ;

    private String localisation;
    @CreatedDate
    private Date date;
    public Pointage( String type, String localisation) {
        this.type = type;
        this.localisation = localisation;
        this.date = new Date();
    }

    public String getPointageId() {
        return pointageId;
    }

    public void setPointageId(String PointageId) {
        this.pointageId = PointageId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocalisation() {
        return localisation;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }
}
