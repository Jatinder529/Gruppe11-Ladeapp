package com.thm.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@CompoundIndexes({
        @CompoundIndex(name="lp_time_idx", def="{ 'ladepunktId':1, 'startzeit':1, 'endzeit':1 }")
})
@Document("reservierung")
public class Reservierung {
    @Id private String id;
    private String benutzerId;
    private String ladepunktId;
    private Instant startzeit;
    private Instant endzeit;
    private Boolean aktiv = true;
    private String feedback;

    public String getId(){ return id; } public void setId(String id){ this.id=id; }
    public String getBenutzerId(){ return benutzerId; } public void setBenutzerId(String b){ this.benutzerId=b; }
    public String getLadepunktId(){ return ladepunktId; } public void setLadepunktId(String l){ this.ladepunktId=l; }
    public Instant getStartzeit(){ return startzeit; } public void setStartzeit(Instant s){ this.startzeit=s; }
    public Instant getEndzeit(){ return endzeit; } public void setEndzeit(Instant e){ this.endzeit=e; }
    public Boolean getAktiv(){ return aktiv; } public void setAktiv(Boolean a){ this.aktiv=a; }
    public String getFeedback(){ return feedback; } public void setFeedback(String f){ this.feedback=f; }
}
 