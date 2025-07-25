package com.squid_configurator.squidconfig.services.enums;

public enum AclServiceDirective {
	HTTP_ACCESS("http_access"),
    HTTP_REPLY_ACCESS("http_reply_access"),
    CACHE("cache"),
    CACHE_DENY("cache deny"),
    DELAY_ACCESS("delay_access"),
    URL_REWRITE_ACCESS("url_rewrite_access"),
    ACCESS_LOG("access_log");

    private final String text;

    AclServiceDirective(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
