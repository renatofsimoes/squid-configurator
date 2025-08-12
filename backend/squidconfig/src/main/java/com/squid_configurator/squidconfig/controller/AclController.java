package com.squid_configurator.squidconfig.controller;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.squid_configurator.squidconfig.editor.AclFileEditor;
import com.squid_configurator.squidconfig.editor.exceptions.ResourceNotFoundException;
import com.squid_configurator.squidconfig.model.Acl;
import com.squid_configurator.squidconfig.services.enums.AclServiceAction;
import com.squid_configurator.squidconfig.services.enums.AclServiceDirective;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/acls")
public class AclController {

	private final AclFileEditor aclFileEditor;

	public AclController(AclFileEditor aclFileEditor) {
		this.aclFileEditor = aclFileEditor;
	}

	@PostMapping
	public ResponseEntity<Acl> createAcl(@RequestBody Acl acl) throws IOException {
		aclFileEditor.addAcl(acl);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{name}").buildAndExpand(acl.getName())
				.toUri();
		return ResponseEntity.created(uri).body(acl);
	}

	@DeleteMapping("/{aclName}")
	public ResponseEntity<Void> deleteAcl(@PathVariable String aclName) throws IOException {
		aclFileEditor.removeAclByName(aclName);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public ResponseEntity<List<String>> findAllAcls() throws IOException {
		List<String> rules = aclFileEditor.listAclRules();
		return ResponseEntity.ok(rules);
	}

	@GetMapping("/{aclName}")
	public ResponseEntity<String> findAclLineByName(@PathVariable String aclName) throws IOException {
		String aclLine = aclFileEditor.findAclLineByName(aclName);
		return ResponseEntity.ok(aclLine);
	}

	@PutMapping("/{aclName}/values/add")
	public ResponseEntity<String> addValueToAcl(@PathVariable String aclName, @RequestBody Map<String, String> body)
			throws IOException {
		String value = body.get("value");
		aclFileEditor.addAclValue(aclName, value);
		String updatedLine = aclFileEditor.findAclLineByName(aclName);
		return ResponseEntity.ok(updatedLine);
	}

	@PutMapping("/{aclName}/values/remove")
	public ResponseEntity<String> removeValueFromAcl(@PathVariable String aclName, @RequestParam String value)
			throws IOException {
		aclFileEditor.removeAclValue(aclName, value);
		try {
		String updatedLine = aclFileEditor.findAclLineByName(aclName);
		return ResponseEntity.ok(updatedLine);
		}catch(ResourceNotFoundException e) {
			return ResponseEntity.noContent().build();
		}
	}

	@PostMapping("/{aclName}/directives")
	public ResponseEntity<String> addDirective(@PathVariable String aclName, @RequestBody Map<String, String> body)
			throws IOException {
		AclServiceDirective directive = AclServiceDirective.valueOf(body.get("directive"));
		AclServiceAction action = AclServiceAction.valueOf(body.get("action"));
		aclFileEditor.addAclDirective(aclName, directive, action);
		String created = aclFileEditor.findAclDirective(aclName, directive, action);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{directive}/{action}")
				.buildAndExpand(directive.name(), action.name()).toUri();
		return ResponseEntity.created(uri).body(created);
	}

	@DeleteMapping("/{aclName}/directives/{directive}")
	public ResponseEntity<String> removeDirective(@PathVariable String aclName, @PathVariable String directive,
			@RequestParam(required = false) String action) throws IOException {
		AclServiceDirective dir = AclServiceDirective.valueOf(directive);
		AclServiceAction act = action != null ? AclServiceAction.valueOf(action) : null;
		aclFileEditor.removeAclDirective(aclName, dir, act);
		return ResponseEntity.noContent().build();
	}

}
