package com.squid_configurator.squidconfig.services;

import org.springframework.stereotype.Service;

@Service
public class ServerService {
	
    // Retorna true se o systemd considera o serviço 'active'
    public boolean isSquidRunning() {
        try {
            Process p = new ProcessBuilder("systemctl", "is-active", "squid").start();
            int exit = p.waitFor();
            return exit == 0; // exit 0 = active
        } catch (Exception e) {
            // em caso de erro, logue (ou trate) e retorne false
            e.printStackTrace();
            return false;
        }
    }

    public void startSquid() throws Exception {
        // Opcional: usar "sudo" se necessário
        Process p = new ProcessBuilder("sudo", "systemctl", "start", "squid").start();
        int exit = p.waitFor();
        if (exit != 0) throw new IllegalStateException("Falha ao iniciar o squid (exit=" + exit + ")");
    }

    public void stopSquid() throws Exception {
        Process p = new ProcessBuilder("sudo", "systemctl", "stop", "squid").start();
        int exit = p.waitFor();
        if (exit != 0) throw new IllegalStateException("Falha ao parar o squid (exit=" + exit + ")");
    }

    public void restartSquid() throws Exception {
        ProcessBuilder builder = new ProcessBuilder("sudo", "systemctl", "restart", "squid");
        Process process = builder.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Falha ao reiniciar o Squid. Código: " + exitCode);
        }
    }

    public void reloadSquid() throws Exception {
        ProcessBuilder builder = new ProcessBuilder("sudo", "systemctl", "reload", "squid");
        Process process = builder.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Falha ao recarregar o Squid. Código: " + exitCode);
        }
    }
}
