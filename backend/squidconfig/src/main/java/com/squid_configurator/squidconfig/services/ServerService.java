package com.squid_configurator.squidconfig.services;

import java.io.IOException;

import org.springframework.stereotype.Service;

@Service
public class ServerService {
	
    // Retorna true se o systemd considera o serviço 'active'
	public boolean isSquidRunning() {
	    try {
	        Process process = new ProcessBuilder("systemctl", "is-active", "--quiet", "squid")
	                .start();

	        int exitCode = process.waitFor();
	        return exitCode == 0; // ativo = true
	    } catch (IOException e) {
	        // não tem systemctl ou não está em ambiente linux
	        System.out.println("Comando systemctl não disponível: " + e.getMessage());
	        return false; // ou: return null, caso queira sinalizar "desconhecido"
	    } catch (InterruptedException e) {
	        throw new RuntimeException(e);
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
