package com.squid_configurator.squidconfig.editor;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.squid_configurator.squidconfig.model.BandWidthRule;
import com.squid_configurator.squidconfig.model.enums.BandWidthType;
import com.squid_configurator.squidconfig.services.BandWidthService;

@Component
public class BandWidthFileEditor extends SquidConfFileEditor {

	private final BandWidthService bandWidthService = new BandWidthService();

	public BandWidthFileEditor(Path configFilePath) {
		super(configFilePath);
	}

	public void addBandWidthRule(BandWidthRule rule) throws IOException {
	    String newLine = bandWidthService.buildBandWidthLine(rule);
	    List<String> lines = readFile();
	    validateLineNotExists(lines, newLine);
	    switch (rule.getType()) {
	        case DELAY_POOLS:
	            boolean delayPoolsExists = lines.stream()
	                .anyMatch(line -> line.trim().startsWith("delay_pools "));
	            if (delayPoolsExists) {
	                throw new IllegalArgumentException("Já existe uma linha 'delay_pools' no arquivo.");
	            }
	            break;
	        case DELAY_CLASS:
	            boolean hasPoolsBeforeClass = lines.stream()
	                .anyMatch(line -> line.trim().startsWith("delay_pools "));
	            if (!hasPoolsBeforeClass) {
	                throw new IllegalArgumentException(
	                    "Não é possível adicionar 'delay_class' sem uma linha 'delay_pools'.");
	            }
	            String poolIdClass = rule.getValue().split("\\s+")[0];
	            boolean duplicateClass = lines.stream()
	                .anyMatch(line -> line.trim().matches("delay_class\\s+" + poolIdClass + "\\b.*"));
	            if (duplicateClass) {
	                throw new IllegalArgumentException(
	                    "Já existe uma linha 'delay_class' para o pool " + poolIdClass + ".");
	            }
	            break;

	        case DELAY_PARAMETERS:
	            boolean hasClassBeforeParameters = lines.stream()
	                .anyMatch(line -> line.trim().startsWith("delay_class "));
	            if (!hasClassBeforeParameters) {
	                throw new IllegalArgumentException(
	                    "Não é possível adicionar 'delay_parameters' sem uma linha 'delay_class'.");
	            }
	            String poolIdParam = rule.getValue().split("\\s+")[0];
	            boolean duplicateParameters = lines.stream()
	                .anyMatch(line -> line.trim().matches("delay_parameters\\s+" + poolIdParam + "\\b.*"));
	            if (duplicateParameters) {
	                throw new IllegalArgumentException(
	                    "Já existe uma linha 'delay_parameters' para o pool " + poolIdParam + ".");
	            }
	            break;
	    }
	    int insertIndex = findInsertionIndex(lines, rule.getType());
	    lines.add(insertIndex, newLine);
	    writeConfigLines(lines);
	}


	public void removeBandWidthRulesByPool(String poolId) throws IOException {
		List<String> lines = readFile();
		List<String> updatedLines = new ArrayList<>();
		boolean anyFound = false;
		for (String line : lines) {
			if (isBandWidthLineOfPool(line, poolId)) {
				anyFound = true;
				continue;
			}
			updatedLines.add(line);
		}
		if (!anyFound) {
			throw new IllegalArgumentException("Nenhuma regra encontrada para o pool " + poolId);
		}
		writeConfigLines(updatedLines);
	}
	
	public List<String> listBandWidthRules() throws IOException {
	    List<String> lines = readFile();
	    return lines.stream()
	        .filter(line -> line.trim().matches("^(delay_pools|delay_class|delay_parameters|delay_access)\\b.*"))
	        .collect(Collectors.toList());
	}

	private boolean isBandWidthLineOfPool(String line, String poolId) {
		String trimmed = line.trim();
		return trimmed.matches("^delay_pools\\s+" + poolId + "\\b.*")
				|| trimmed.matches("^delay_class\\s+" + poolId + "\\b.*")
				|| trimmed.matches("^delay_parameters\\s+" + poolId + "\\b.*")
				|| trimmed.matches("^delay_access\\s+" + poolId + "\\b.*");
	}

	private int findInsertionIndex(List<String> lines, BandWidthType type) {
		int index = 0;
		switch (type) {
		case DELAY_POOLS:
			for (int i = 0; i < lines.size(); i++) {
				String line = lines.get(i).trim();
				if (line.startsWith("acl ") || line.startsWith("http_access ") || line.startsWith("http_reply_access ")
						|| line.startsWith("url_rewrite_access ") || line.startsWith("delay_access ")
						|| line.startsWith("cache ") || line.startsWith("cache_deny ")
						|| line.startsWith("access_log ")) {
					index = i + 1;
				}
			}
			return index;
		case DELAY_CLASS:
			for (int i = 0; i < lines.size(); i++) {
				String line = lines.get(i).trim();
				if (line.startsWith("delay_class ")) {
					index = i + 1;
				} else if (line.startsWith("delay_parameters ")) {
					break;
				}
			}
			return index;
		case DELAY_PARAMETERS:
			for (int i = 0; i < lines.size(); i++) {
				String line = lines.get(i).trim();
				if (line.startsWith("delay_parameters ")) {
					index = i + 1;
				}
			}
			if (index == 0) {
				for (int i = 0; i < lines.size(); i++) {
					String line = lines.get(i).trim();
					if (line.startsWith("delay_class ")) {
						index = i + 1;
					}
				}
			}
			return index;
		default:
			return lines.size();
		}
	}
}
