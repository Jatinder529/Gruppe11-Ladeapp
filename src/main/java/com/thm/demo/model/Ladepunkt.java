package com.thm.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonInclude;

@Document("ladepunkt")
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Ladepunkt {
    @Id
    private String ladepunktId;


    private String standort;
    private Integer nummer;
    private String status;
    private Boolean reservierungAktiv;


    private String adresse;
    private Integer leistungKw;
    private Boolean parkdeck;
    private String typ;
}
