package com.squid_configurator.squidconfig.editor;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ServerFileEditor extends SquidConfFileEditor {

    public ServerFileEditor(java.nio.file.Path configFilePath) {
        super(configFilePath);
    }

    /**
     * Retorna true se existir exatamente uma linha "http_access deny all" (ignora espaços e case).
     */
    public boolean hasDenyAllRule() throws IOException {
        List<String> lines = readFile();
        return lines.stream()
                .map(String::trim)
                .anyMatch(l -> l.equalsIgnoreCase("http_access deny all"));
    }

    /**
     * Adiciona "http_access deny all" no final do arquivo se não existir ainda.
     */
    public void addDenyAllRule() throws IOException {
        List<String> lines = readFile();
        boolean exists = lines.stream()
                .map(String::trim)
                .anyMatch(l -> l.equalsIgnoreCase("http_access deny all"));
        if (!exists) {
            lines.add("http_access deny all");
            writeConfigLines(lines);
        }
    }
    
    public void removeDenyAllRule() throws IOException {
        List<String> lines = readFile();
        boolean changed = lines.removeIf(l -> l.trim().equalsIgnoreCase("http_access deny all"));
        if (changed) {
            writeConfigLines(lines);
        }
    }

}
