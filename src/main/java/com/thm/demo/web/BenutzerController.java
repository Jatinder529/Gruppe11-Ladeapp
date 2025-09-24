package com.thm.demo.web;

import com.thm.demo.model.Benutzer;
import com.thm.demo.repo.BenutzerRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/benutzer")
@CrossOrigin
public class BenutzerController {
    private final BenutzerRepository repo;
    public BenutzerController(BenutzerRepository repo){ this.repo = repo; }

    @GetMapping public List<Benutzer> all(){ return repo.findAll(); }
    @PostMapping public Benutzer create(@RequestBody Benutzer b){ return repo.save(b); }
}
