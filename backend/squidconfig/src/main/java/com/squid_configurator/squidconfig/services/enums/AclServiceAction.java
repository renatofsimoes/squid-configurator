package com.squid_configurator.squidconfig.services.enums;

public enum AclServiceAction {
	ALLOW("allow"),
	DENY("deny");

	private final String text;

	AclServiceAction(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}
}
