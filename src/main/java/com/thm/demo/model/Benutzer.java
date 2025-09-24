package com.thm.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("benutzer")
public class Benutzer {
    @Id private String id;
    private String name;
    @Indexed(unique = true) private String email;
    private String rolle;
    private String passwortHash;
    private Boolean benachrichtigungAktiv = true;

    public String getId() { return id; }      public void setId(String id){ this.id=id; }
    public String getName(){ return name; }    public void setName(String name){ this.name=name; }
    public String getEmail(){ return email; }  public void setEmail(String email){ this.email=email; }
    public String getRolle(){ return rolle; }  public void setRolle(String rolle){ this.rolle=rolle; }
    public String getPasswortHash(){ return passwortHash; } public void setPasswortHash(String p){ this.passwortHash=p; }
    public Boolean getBenachrichtigungAktiv(){ return benachrichtigungAktiv; } public void setBenachrichtigungAktiv(Boolean b)
    { this.benachrichtigungAktiv=b; }
}
