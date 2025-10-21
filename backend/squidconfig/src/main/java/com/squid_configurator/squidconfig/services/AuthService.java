package com.squid_configurator.squidconfig.services;

import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private static final String VALID_USERNAME = "admin";
    private static final String VALID_PASSWORD = "!!@@##$$";

    public boolean authenticate(String username, String password) {
        return VALID_USERNAME.equals(username) && VALID_PASSWORD.equals(password);
    }
}


