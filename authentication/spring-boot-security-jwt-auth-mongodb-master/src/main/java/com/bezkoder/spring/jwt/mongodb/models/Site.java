package com.bezkoder.spring.jwt.mongodb.models;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "sites")
public class Site {
    @Id
    private String siteId;
    private String localisation;

    private String name;
    @DBRef
    private Set<User> users = new HashSet<>();

    public Site() {
    }

    public Site(String localisation) {
        this.localisation = localisation;
    }

    public String getSiteId() {
        return siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    public String getLocalisation() {
        return localisation;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addUser(User user) {
        this.users.add(user);
    }
    public void deleteUser(User user) {
        this.users.remove(user);
    }
}
