package com.squid_configurator.squidconfig.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.squid_configurator.squidconfig.editor.BandWidthFileEditor;
import com.squid_configurator.squidconfig.model.BandWidthRule;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bandwidth")
public class BandWidthController {

    private final BandWidthFileEditor bandWidthFileEditor;

    public BandWidthController(BandWidthFileEditor bandWidthFileEditor) {
        this.bandWidthFileEditor = bandWidthFileEditor;
    }

    @PostMapping
    public ResponseEntity<String> createRule(@RequestBody BandWidthRule rule) {
        try {
            bandWidthFileEditor.addBandWidthRule(rule);
            return ResponseEntity.ok("Regra de largura de banda adicionada com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{poolId}")
    public ResponseEntity<String> deleteRulesByPool(@PathVariable String poolId) {
        try {
            bandWidthFileEditor.removeBandWidthRulesByPool(poolId);
            return ResponseEntity.ok("Regras do pool " + poolId + " removidas com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<String>> findAllRules() {
        try {
            List<String> rules = bandWidthFileEditor.listBandWidthRules();
            return ResponseEntity.ok(rules);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

