package com.thm.demo.service;

import com.thm.demo.model.Reservierung;
import com.thm.demo.repo.LadepunktRepository;
import com.thm.demo.repo.ReservierungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservierungService {

    private final ReservierungRepository reservierungRepository;
    private final LadepunktRepository ladepunktRepository;

    /** Alle Reservierungen eines Benutzers */
    public List<Reservierung> byUser(String benutzerId) {
        if (benutzerId == null || benutzerId.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "benutzerId fehlt");
        // Repo sollte diese Methode haben:
        return reservierungRepository.findByBenutzerId(benutzerId);
    }

    /** Alle Reservierungen zu einem Ladepunkt */
    public List<Reservierung> byLadepunkt(String ladepunktId) {
        if (ladepunktId == null || ladepunktId.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ladepunktId fehlt");
        // Repo sollte diese Methode haben:
        return reservierungRepository.findByLadepunktId(ladepunktId);
    }

    /**
     * Neue Reservierung anlegen (noch nicht "gestartet"):
     * - startzeit: default = now
     * - endzeit:   default = start + 60min
     * - max. 30 Minuten im Voraus
     * - keine Überschneidung für den Ladepunkt
     */
    public Reservierung create(Reservierung r) {
        // Basisfelder prüfen
        if (r == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body fehlt");
        if (r.getBenutzerId() == null || r.getBenutzerId().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "benutzerId fehlt");
        if (r.getLadepunktId() == null || r.getLadepunktId().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ladepunktId fehlt");

        // Ladepunkt existiert?
        if (!ladepunktRepository.existsById(r.getLadepunktId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ladepunkt nicht gefunden");

        // Defaults
        Instant now = Instant.now();
        if (r.getStartzeit() == null) r.setStartzeit(now);
        if (r.getEndzeit() == null)   r.setEndzeit(r.getStartzeit().plus(60, ChronoUnit.MINUTES));

        // Zeitlogik
        if (!r.getEndzeit().isAfter(r.getStartzeit()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endzeit muss nach Startzeit liegen");

        // 30-Minuten-Regel: startzeit darf höchstens now+30min in der Zukunft liegen
        if (r.getStartzeit().isAfter(now.plus(30, ChronoUnit.MINUTES)))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max. 30 Minuten im Voraus");

        // Überschneidung mit bestehenden aktiven/überlappenden Reservierungen prüfen
        // -> Stelle sicher, dass dein ReservierungRepository die Query-Methode existsOverlap(...) hat.
        boolean overlap = reservierungRepository.countOverlap(
                r.getLadepunktId(), r.getStartzeit(), r.getEndzeit()) > 0;
        if (overlap)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Zeitfenster bereits belegt");

        // Als Reservierung anlegen (noch nicht aktiv; "Start" macht /reservierungen/start)
        r.setAktiv(false);
        return reservierungRepository.save(r);
    }

    /**
     * Reservierung stornieren:
     * - setzt aktiv=false, endzeit=now
     * - gibt ggf. den Ladepunkt frei (falls aktiv gewesen)
     */
    public void cancel(String id) {
        var r = reservierungRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservierung nicht gefunden"));

        // "Beenden" der Reservierung
        r.setAktiv(false);
        r.setEndzeit(Instant.now());
        reservierungRepository.save(r);

        // Ladepunkt freigeben (falls er belegt war)
        ladepunktRepository.findById(r.getLadepunktId()).ifPresent(lp -> {
            // Defensive: auf "frei" setzen
            lp.setStatus("frei");
            ladepunktRepository.save(lp);
        });
    }
}
