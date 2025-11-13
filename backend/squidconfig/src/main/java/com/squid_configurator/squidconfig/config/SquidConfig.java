package com.squid_configurator.squidconfig.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.squid_configurator.squidconfig.editor.AclFileEditor;

@Configuration
public class SquidConfig {

    @Bean
    Path configFilePath() {
        return Paths.get("D:\\TCC-UNESP\\Squid-Configurator\\backend\\squidconfig\\teste_squid.conf"); // /etc/squid/squid.conf
    }

    @Bean
    AclFileEditor aclFileEditor(Path configFilePath) {
        return new AclFileEditor(configFilePath);
    }
}

