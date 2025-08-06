package com.squid_configurator.squidconfig.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.squid_configurator.squidconfig.editor.CacheFileEditor;
import com.squid_configurator.squidconfig.model.CacheRule;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/cache")
public class CacheController {

    private final CacheFileEditor cacheFileEditor;

    public CacheController(CacheFileEditor cacheFileEditor) {
        this.cacheFileEditor = cacheFileEditor;
    }

    @PostMapping
    public ResponseEntity<String> createCacheRule(@RequestBody CacheRule rule) {
        try {
            cacheFileEditor.addCacheRule(rule);
            return ResponseEntity.ok("Regra de cache adicionada com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<String> removeCacheRule(@RequestBody CacheRule rule) {
        try {
            cacheFileEditor.removeCacheRule(rule);
            return ResponseEntity.ok("Regra de cache removida com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<String>> findAllCacheRules() {
        try {
            List<String> rules = cacheFileEditor.listCacheRules();
            return ResponseEntity.ok(rules);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
