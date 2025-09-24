package com.thm.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://10.0.2.2", "http://localhost", "http://127.0.0.1")
                        .allowedOriginPatterns("*") // dev: alles erlauben
                        .allowedMethods("GET","POST","PATCH","PUT","DELETE");
            }
        };
    }
}
