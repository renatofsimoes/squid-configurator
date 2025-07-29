package com.squid_configurator.squidconfig.model;

import com.squid_configurator.squidconfig.model.enums.CacheType;

public class CacheRule{
	private CacheType type;
	private String value;

	public CacheRule(CacheType type, String value) {
		this.type = type;
		this.value = value;
	}

	
	public CacheType getType() {
		return type;
	}
	public void setType(CacheType type) {
		this.type = type;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
}
