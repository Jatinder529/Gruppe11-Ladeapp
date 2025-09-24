package com.thm.demo.repo;

import com.thm.demo.model.Benutzer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface BenutzerRepository extends MongoRepository<Benutzer, String> {
    Optional<Benutzer> findByEmail(String email);
}
