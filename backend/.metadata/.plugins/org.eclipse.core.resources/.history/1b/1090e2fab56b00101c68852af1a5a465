package com.squid_configurator.squidconfig.services;

import com.squid_configurator.squidconfig.model.AclRule;
import com.squid_configurator.squidconfig.services.enums.AclServiceAction;
import com.squid_configurator.squidconfig.services.enums.AclServiceDirective;

public class AclService {

	public String buildAclLine(AclRule acl) {
		String name = "acl " + acl.getName().trim();
		String value = acl.getValue();
		switch (acl.getAclType()) {
		case SRC:
			return name + " src " + value;
		case DST:
			return name + " dst " + value;
		case DSTDOMAIN:
			return name + " dstdomain " + value;
		case PORT:
			return name + " port " + value;
		case TIME:
			return name + " time MTWHF " + value;
		case URL_REGEX:
			return name + " url_regex -i " + value;
		default:
			throw new IllegalArgumentException("Tipo de ACL não suportado: " + acl.getAclType());
		}
	}

	public String addAclLineValue(String line, String newValue) {
		return line + " " + newValue;
	}

	public String removeAclLineValue(String line, String removedValue) {
		StringBuilder resultado = new StringBuilder();
		String[] values = line.trim().split("\\s+");

		for (String value : values) {
			if (!value.equals(removedValue)) {
				resultado.append(value).append(" ");
			}
		}
		return resultado.toString().trim();
	}

	public String buildAclLineDirective(String aclName, AclServiceDirective directive, AclServiceAction action) {
		switch (directive) {
		case HTTP_ACCESS:
		case HTTP_REPLY_ACCESS:
		case URL_REWRITE_ACCESS:
		case DELAY_ACCESS:
			return directive.getText() + " " + action.getText() + " " + aclName;
		case CACHE:
		case CACHE_DENY:
			return directive.getText() + " " + aclName;
		case ACCESS_LOG:
			return "access_log /var/log/squid/access.log squid " + aclName;
		default:
			throw new IllegalArgumentException("Diretiva não suportada: " + directive);
		}
	}

}
