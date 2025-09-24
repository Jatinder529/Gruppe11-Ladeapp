package com.thm.demo.repo;

import com.thm.demo.model.Ladepunkt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LadepunktRepository extends MongoRepository<Ladepunkt, String> {
    List<Ladepunkt> findByStandort(String standort);


}
