package com.thm.demo.repo;

import com.thm.demo.model.Reservierung;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;

public interface ReservierungRepository extends MongoRepository<Reservierung, String> {

    List<Reservierung> findByBenutzerId(String benutzerId);
    List<Reservierung> findByLadepunktId(String ladepunktId);

    @Query(
            value = "{ 'ladepunktId': ?0, $or: [ " +
                    "  { 'aktiv': true }, " +
                    "  { $and: [ { 'startzeit': { $lt: ?2 } }, { 'endzeit': { $gt: ?1 } } ] } " +
                    "] }",
            count = true
    )
    long countOverlap(String ladepunktId, Instant start, Instant end);
}
