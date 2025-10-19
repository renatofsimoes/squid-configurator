package com.squid_configurator.squidconfig.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
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


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/cacherules")
public class CacheController {

    private final CacheFileEditor cacheFileEditor;

    public CacheController(CacheFileEditor cacheFileEditor) {
        this.cacheFileEditor = cacheFileEditor;
    }

    @PostMapping
    public ResponseEntity<CacheRule> createCacheRule(@RequestBody CacheRule rule) throws IOException {
            cacheFileEditor.addCacheRule(rule);
            return ResponseEntity.status(HttpStatus.CREATED).body(rule);
    }

    @DeleteMapping
    public ResponseEntity<String> removeCacheRule(@RequestBody CacheRule rule) throws IOException {
            cacheFileEditor.removeCacheRule(rule);
            return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<String>> findAllCacheRules() throws IOException {
            List<String> rules = cacheFileEditor.listCacheRules();
            return ResponseEntity.ok(rules);
    }
}
