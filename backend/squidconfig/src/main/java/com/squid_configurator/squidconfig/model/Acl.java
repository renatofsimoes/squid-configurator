package com.squid_configurator.squidconfig.model;

import com.squid_configurator.squidconfig.model.enums.AclType;

public class Acl {

	private String name;
	private AclType aclType;
	private String value;

	public Acl(String name, AclType aclType, String value) {
		this.name = name;
		this.aclType = aclType;
		this.value = value;
	}

	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public AclType getAclType() {
		return aclType;
	}
	public void setType(String type) {
	    this.aclType = AclType.fromString(type);
	}

	public void setAclType(AclType aclType) {
		this.aclType = aclType;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
}
