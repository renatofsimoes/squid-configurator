package com.squid_configurator.squidconfig.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.squid_configurator.squidconfig.editor.ServerFileEditor;
import com.squid_configurator.squidconfig.services.ServerService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/server")
public class ServerController {

    private final ServerFileEditor serverFileEditor;
    
    private final ServerService serverService;

    public ServerController(ServerFileEditor serverFileEditor, ServerService serverService) {
        this.serverFileEditor = serverFileEditor;
        this.serverService = serverService;
    }

    /**
     * Verifica se existe a linha "http_access deny all".
     * Retorna { "exists": true/false }
     */
    @GetMapping("/deny-all")
    public ResponseEntity<Map<String, Boolean>> checkDenyAll() throws IOException {
        boolean exists = serverFileEditor.hasDenyAllRule();
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    /**
     * Adiciona a linha "http_access deny all" no fim do arquivo (se não existir).
     */
    @PostMapping("/deny-all")
    public ResponseEntity<Void> addDenyAll() throws IOException {
        serverFileEditor.addDenyAllRule();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    
    @DeleteMapping("/deny-all")
    public ResponseEntity<Void> removeDenyAll() throws IOException {
        serverFileEditor.removeDenyAllRule();
        return ResponseEntity.noContent().build();
    }
    
 // retorna { running: true/false }
    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> status() {
        boolean running = serverService.isSquidRunning();
        return ResponseEntity.ok(Map.of("running", running));
    }
    
    @PostMapping("/start")
    public ResponseEntity<String> start() {
        try {
            serverService.startSquid();
            return ResponseEntity.ok("Squid iniciado");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao iniciar squid: " + e.getMessage());
        }
    }

    @PostMapping("/stop")
    public ResponseEntity<String> stop() {
        try {
            serverService.stopSquid();
            return ResponseEntity.ok("Squid parado");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao parar squid: " + e.getMessage());
        }
    }
    
    @PostMapping("/restart")
    public ResponseEntity<String> restart() {
        try {
            serverService.restartSquid();
            return ResponseEntity.ok("Squid reiniciado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao reiniciar: " + e.getMessage());
        }
    }

    @PostMapping("/reload")
    public ResponseEntity<String> reload() {
        try {
            serverService.reloadSquid();
            return ResponseEntity.ok("Squid recarregado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao recarregar: " + e.getMessage());
        }
    }
    
    @GetMapping("/config")
    public ResponseEntity<String> getSquidConfig() {
        try {
            String content = serverService.readSquidConf();
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao ler squid.conf: " + e.getMessage());
        }
    }


}
