package com.thm.demo.web;

import com.thm.demo.model.Ladepunkt;
import com.thm.demo.repo.LadepunktRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ladepunkte")
@CrossOrigin
public class LadepunktController {
    private final LadepunktRepository repo;
    private final LadepunktRepository ladepunktRepository;

    public LadepunktController(LadepunktRepository repo, LadepunktRepository ladepunktRepository){ this.repo = repo;
        this.ladepunktRepository = ladepunktRepository;
    }

    @GetMapping("/api/ladepunkte")
    public List<Ladepunkt> all(@RequestParam(required = false) String standort){
        return (standort == null || standort.isBlank())
                ? ladepunktRepository.findAll()
                : ladepunktRepository.findByStandort(standort);
    }



    @GetMapping public List<Ladepunkt> all(){ return repo.findAll(); }
    @PostMapping public Ladepunkt create(@RequestBody Ladepunkt l){ return repo.save(l); }
}
