package com.thm.demo.web;

import com.thm.demo.model.Benutzer;
import com.thm.demo.repo.BenutzerRepository;
import com.thm.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final BenutzerRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public record RegisterReq(String name, String email, String password) {}
    public record LoginReq(String email, String password) {}
    public record AuthRes(String token, Benutzer user) {}

    @PostMapping("/register")
    public ResponseEntity<AuthRes> register(@RequestBody RegisterReq r) {
        if (users.findByEmail(r.email()).isPresent()) return ResponseEntity.status(409).build();
        var u = new Benutzer();
        u.setName(r.name());
        u.setEmail(r.email());
        u.setRolle("student");
        u.setBenachrichtigungAktiv(true);
        u.setPasswortHash(encoder.encode(r.password()));
        users.save(u);
        return ResponseEntity.ok(new AuthRes(jwt.generate(u.getId(), u.getEmail()), u));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthRes> login(@RequestBody LoginReq r) {
        var u = users.findByEmail(r.email()).orElse(null);
        if (u == null || !encoder.matches(r.password(), u.getPasswortHash()))
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(new AuthRes(jwt.generate(u.getId(), u.getEmail()), u));
    }

    @GetMapping("/me")
    public ResponseEntity<Benutzer> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return users.findById(auth.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
