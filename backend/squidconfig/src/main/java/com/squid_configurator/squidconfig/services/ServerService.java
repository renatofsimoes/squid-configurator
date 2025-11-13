package com.squid_configurator.squidconfig.services;

import java.io.IOException;

import org.springframework.stereotype.Service;

@Service
public class ServerService {
	
	public boolean isSquidRunning() {
	    try {
	        Process process = new ProcessBuilder("systemctl", "is-active", "--quiet", "squid")
	                .start();

	        int exitCode = process.waitFor();
	        return exitCode == 0;
	    } catch (IOException e) {
	        System.out.println("Comando systemctl não disponível: " + e.getMessage());
	        return false;
	    } catch (InterruptedException e) {
	        throw new RuntimeException(e);
	    }
	}


    public void startSquid() throws Exception {
        Process p = new ProcessBuilder("/usr/bin/sudo", "/usr/bin/systemctl", "start", "squid").start();
        int exit = p.waitFor();
        if (exit != 0) throw new IllegalStateException("Falha ao iniciar o squid (exit=" + exit + ")");
    }

    public void stopSquid() throws Exception {
        Process p = new ProcessBuilder("/usr/bin/sudo", "/usr/bin/systemctl", "stop", "squid").start();
        int exit = p.waitFor();
        if (exit != 0) throw new IllegalStateException("Falha ao parar o squid (exit=" + exit + ")");
    }

    public void restartSquid() throws Exception {
        ProcessBuilder builder = new ProcessBuilder("/usr/bin/sudo", "/usr/bin/systemctl", "restart", "squid");
        Process process = builder.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Falha ao reiniciar o Squid. Código: " + exitCode);
        }
    }

    public void reloadSquid() throws Exception {
        ProcessBuilder builder = new ProcessBuilder("/usr/bin/sudo", "/usr/bin/systemctl", "reload", "squid");
        Process process = builder.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Falha ao recarregar o Squid. Código: " + exitCode);
        }
    }
    
    public String readSquidConf() throws IOException {
        String path = "D:\\\\TCC-UNESP\\\\Squid-Configurator\\\\backend\\\\squidconfig\\\\teste_squid.conf"; // /etc/squid/squid.conf
        return new String(java.nio.file.Files.readAllBytes(java.nio.file.Path.of(path)));
    }

}
