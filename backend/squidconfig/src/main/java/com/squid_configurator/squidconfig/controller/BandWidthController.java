package com.squid_configurator.squidconfig.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.squid_configurator.squidconfig.editor.BandWidthFileEditor;
import com.squid_configurator.squidconfig.model.BandWidthRule;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/bandwidthrules")
public class BandWidthController {

	private final BandWidthFileEditor bandWidthFileEditor;

	public BandWidthController(BandWidthFileEditor bandWidthFileEditor) {
		this.bandWidthFileEditor = bandWidthFileEditor;
	}

	@PostMapping
	public ResponseEntity<BandWidthRule> createRule(@RequestBody BandWidthRule rule) throws IOException {
		bandWidthFileEditor.addBandWidthRule(rule);
		return ResponseEntity.status(HttpStatus.CREATED).body(rule);
	}

	@DeleteMapping("/{poolId}")
	public ResponseEntity<String> deleteRulesByPool(@PathVariable String poolId) throws IOException {
		bandWidthFileEditor.removeBandWidthRulesByPool(poolId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public ResponseEntity<List<String>> findAllRules() throws IOException {
		List<String> rules = bandWidthFileEditor.listBandWidthRules();
		return ResponseEntity.ok(rules);
	}

	@DeleteMapping("/delaypools")
	public ResponseEntity<String> deleteDelayPoolsAndRules() throws IOException {
		bandWidthFileEditor.removeDelayPoolsAndAllRules();
		return ResponseEntity.noContent().build();
	}

}
