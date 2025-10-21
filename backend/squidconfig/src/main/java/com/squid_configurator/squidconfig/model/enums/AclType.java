package com.squid_configurator.squidconfig.model.enums;

public enum AclType {
    SRC,
    DST,
    DSTDOMAIN,
    PORT,
    TIME,
    URL_REGEX;

    public static AclType fromString(String type) {
        switch (type.toUpperCase()) {
            case "SRC": return SRC;
            case "DST": return DST;
            case "DSTDOMAIN": return DSTDOMAIN;
            case "PORT": return PORT;
            case "TIME": return TIME;
            case "URL_REGEX": return URL_REGEX;
            default:
                throw new IllegalArgumentException("Tipo de ACL inválido: " + type);
        }
    }
}
