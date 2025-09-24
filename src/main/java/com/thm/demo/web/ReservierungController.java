package com.thm.demo.web;

import com.thm.demo.model.Ladepunkt;          // <— NEU
import com.thm.demo.model.Reservierung;
import com.thm.demo.repo.LadepunktRepository;
import com.thm.demo.repo.ReservierungRepository;
import com.thm.demo.service.ReservierungService;
import org.springframework.http.ResponseEntity; // <— NEU
import org.springframework.web.bind.annotation.*;

import java.time.Instant;                      // <— NEU
import java.util.Map;                          // <— NEU
import java.util.List;

@RestController
@RequestMapping("/api/reservierungen")
@CrossOrigin
public class ReservierungController {

    private final ReservierungService service;
    private final ReservierungRepository reservierungRepository;
    private final LadepunktRepository ladepunktRepository;

    public ReservierungController(ReservierungService service,
                                  ReservierungRepository reservierungRepository,
                                  LadepunktRepository ladepunktRepository) {
        this.service = service;
        this.reservierungRepository = reservierungRepository;
        this.ladepunktRepository = ladepunktRepository;
    }

    @GetMapping(params="benutzerId")
    public List<Reservierung> byUser(@RequestParam String benutzerId){
        return service.byUser(benutzerId);
    }

    @GetMapping(params="ladepunktId")
    public List<Reservierung> byLp(@RequestParam String ladepunktId){
        return service.byLadepunkt(ladepunktId);
    }

    @PostMapping
    public Reservierung create(@RequestBody Reservierung r){
        return service.create(r);
    }

    @PatchMapping("/{id}/cancel")
    public void cancel(@PathVariable String id){
        service.cancel(id);
    }

    // Startet einen Ladevorgang: Reservierung aktiv & Ladepunkt belegt
    @PostMapping("/start")   // <— NUR "/start" (ohne "reservierungen")
    public ResponseEntity<Reservierung> start(@RequestBody Map<String, String> body) {
        try {
            String benutzerId = body.get("benutzerId");
            String ladepunktId = body.get("ladepunktId");
            if (benutzerId == null || ladepunktId == null) {
                return ResponseEntity.badRequest().build();
            }

            Reservierung r = new Reservierung();
            r.setBenutzerId(benutzerId);
            r.setLadepunktId(ladepunktId);
            r.setStartzeit(Instant.now());
            r.setAktiv(true);
            reservierungRepository.save(r);

            Ladepunkt lp = ladepunktRepository.findById(ladepunktId).orElseThrow();
            lp.setStatus("belegt");
            ladepunktRepository.save(lp);

            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Beendet Ladevorgang: Endzeit & Ladepunkt wieder frei
    @PostMapping("/{id}/end") // <— NUR "/{id}/end"
    public ResponseEntity<Reservierung> end(@PathVariable String id) {
        try {
            Reservierung r = reservierungRepository.findById(id).orElse(null);
            if (r == null) return ResponseEntity.notFound().build();

            r.setEndzeit(Instant.now());
            r.setAktiv(false);
            reservierungRepository.save(r);

            Ladepunkt lp = ladepunktRepository.findById(r.getLadepunktId()).orElse(null);
            if (lp != null) {
                lp.setStatus("frei");
                ladepunktRepository.save(lp);
            }
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/feedback")
    public ResponseEntity<Reservierung> feedback(@PathVariable String id, @RequestBody Map<String,String> b){
        String f = (b.get("feedback")==null) ? "" : b.get("feedback").toLowerCase();
        var allowed = List.of("sehr_gut","gut","neutral","schlecht");
        if (!allowed.contains(f)) return ResponseEntity.badRequest().build();

        var r = reservierungRepository.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        r.setFeedback(f);
        reservierungRepository.save(r);
        return ResponseEntity.ok(r);
    }

}
