package com.squid_configurator.squidconfig.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.squid_configurator.squidconfig.editor.AclFileEditor;
import com.squid_configurator.squidconfig.model.Acl;
import com.squid_configurator.squidconfig.services.enums.AclServiceAction;
import com.squid_configurator.squidconfig.services.enums.AclServiceDirective;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/acl")
public class AclController {

    private final AclFileEditor aclFileEditor;

    public AclController(AclFileEditor aclFileEditor) {
        this.aclFileEditor = aclFileEditor;
    }

    @PostMapping
    public ResponseEntity<String> createAcl(@RequestBody Acl acl) {
        try {
            aclFileEditor.addAcl(acl);
            return ResponseEntity.ok("ACL adicionada com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<String> deleteAcl(@PathVariable String name) {
        try {
            aclFileEditor.removeAclByName(name);
            return ResponseEntity.ok("ACL removida com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<String>> findAllAcls() {
        try {
            List<String> rules = aclFileEditor.listAclRules();
            return ResponseEntity.ok(rules);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{name}/value")
    public ResponseEntity<String> addValueToAcl(
            @PathVariable String name,
            @RequestBody Map<String, String> body) {
        try {
            String value = body.get("value");
            aclFileEditor.addAclValue(name, value);
            return ResponseEntity.ok("Valor adicionado à ACL com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{name}/value")
    public ResponseEntity<String> removeValueFromAcl(
            @PathVariable String name,
            @RequestParam String value) {
        try {
            aclFileEditor.removeAclValue(name, value);
            return ResponseEntity.ok("Valor removido da ACL com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{name}/directive")
    public ResponseEntity<String> addDirective(
            @PathVariable String name,
            @RequestBody Map<String, String> body) {
        try {
            AclServiceDirective directive = AclServiceDirective.valueOf(body.get("directive"));
            AclServiceAction action = AclServiceAction.valueOf(body.get("action"));
            aclFileEditor.addAclDirective(name, directive, action);
            return ResponseEntity.ok("Diretiva adicionada com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{name}/directive")
    public ResponseEntity<String> removeDirective(
            @PathVariable String name,
            @RequestParam String directive,
            @RequestParam(required = false) String action) {
        try {
            AclServiceDirective dir = AclServiceDirective.valueOf(directive);
            AclServiceAction act = action != null ? AclServiceAction.valueOf(action) : null;
            aclFileEditor.removeAclDirective(name, dir, act);
            return ResponseEntity.ok("Diretiva removida com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

