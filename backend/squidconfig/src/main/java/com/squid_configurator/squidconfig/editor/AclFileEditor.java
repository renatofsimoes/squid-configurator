package com.squid_configurator.squidconfig.editor;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.squid_configurator.squidconfig.editor.exceptions.ResourceNotFoundException;
import com.squid_configurator.squidconfig.model.Acl;
import com.squid_configurator.squidconfig.services.AclService;
import com.squid_configurator.squidconfig.services.enums.AclServiceAction;
import com.squid_configurator.squidconfig.services.enums.AclServiceDirective;

@Component
public class AclFileEditor extends SquidConfFileEditor{
	
	private final AclService aclService = new AclService();

    public AclFileEditor(Path configFilePath) {
        super(configFilePath);
    }
	

	public void addAcl(Acl aclRule) throws IOException {
		String newLine = aclService.buildAclLine(aclRule);
		List<String> lines = readFile();
		boolean exists = lines.stream().anyMatch(line -> line.startsWith("acl " + aclRule.getName() + " "));
		if (exists) {
			throw new IllegalArgumentException("ACL com nome '" + aclRule.getName() + "' já existe.");
		}
		int insertIndex = -1;
		for (int i = 0; i < lines.size(); i++) {
			if (lines.get(i).startsWith("acl ")) {
					insertIndex = i;
			}
		}
		if (insertIndex == -1) {
			lines.add(0, newLine);
		} else {
		lines.add(insertIndex + 1, newLine);
		}
		writeConfigLines(lines);
	}

	public void removeAclByName(String aclName) throws IOException {
	    List<String> lines = readFile();
	    List<String> filtered = new ArrayList<>();
	    boolean aclFound = false;
	    for (String line : lines) {
	        if (line.startsWith("acl " + aclName + " ")) {
	            aclFound = true;
	            continue;
	        }
	        filtered.add(line);
	    }
	    if (!aclFound) {
	    	throw new ResourceNotFoundException("ACL com nome '" + aclName + "' não encontrada no arquivo.");
	    }
	    writeConfigLines(filtered);
	    removeAllAclDirectivesByName(aclName);
	}


	public void addAclValue(String aclName, String newValue) throws IOException {
	    List<String> lines = readFile();
	    List<String> updatedLines = new ArrayList<>();
	    boolean aclFound = false;
	    for (String line : lines) {
	        if (line.startsWith("acl " + aclName + " ")) {
	            if (line.contains(newValue)) {
	                throw new IllegalArgumentException("O valor '" + newValue + "' já existe na ACL '" + aclName + "'.");
	            }
	            String editedLine = aclService.addAclLineValue(line, newValue);
	            updatedLines.add(editedLine);
	            aclFound = true;
	        } else {
	            updatedLines.add(line);
	        }
	    }
	    if (!aclFound) {
	    	throw new ResourceNotFoundException("ACL com nome '" + aclName + "' não encontrada no arquivo.");
	    }
	    writeConfigLines(updatedLines);
	}

	public void removeAclValue(String aclName, String valueToRemove) throws IOException {
	    List<String> lines = readFile();
	    List<String> updatedLines = new ArrayList<>();
	    boolean aclFound = false;
	    boolean valueRemoved = false;
	    for (String line : lines) {
	        if (!line.startsWith("acl " + aclName + " ")) {
	            updatedLines.add(line);
	            continue;
	        }
	        aclFound = true;
	        if (!line.contains(valueToRemove)) {
	            updatedLines.add(line);
	            continue;
	        }
	        String editedLine = aclService.removeAclLineValue(line, valueToRemove);
	        valueRemoved = true;
	        String[] tokens = editedLine.trim().split("\\s+");
	        if (tokens.length > 3) {
	            updatedLines.add(editedLine);
	        } else {
	            removeAclByName(aclName);
	            return;
	        }
	    }
	    if (!aclFound) {
	        throw new ResourceNotFoundException("ACL com nome '" + aclName + "' não encontrada no arquivo.");
	    }
	    if (!valueRemoved) {
	        throw new ResourceNotFoundException("Valor '" + valueToRemove + "' não encontrado na ACL '" + aclName + "'.");
	    }
	    writeConfigLines(updatedLines);
	}


	public void addAclDirective(String aclName, AclServiceDirective directive, AclServiceAction action)
	        throws IOException {
	    String newLine = aclService.buildAclDirectiveLine(aclName, directive, action);
	    List<String> lines = readFile();
	    boolean directiveExistsForAcl = lines.stream().anyMatch(line ->
	        line.startsWith(directive.getText() + " ") &&
	        line.trim().endsWith(" " + aclName)
	    );
	    if (directiveExistsForAcl) {
	        throw new IllegalArgumentException("Já existe uma diretiva '" + directive.getText()
	            + "' aplicada à ACL '" + aclName + "', não é permitido adicionar outra.");
	    }
	    int insertIndex = -1;
	    for (int i = 0; i < lines.size(); i++) {
	        if (lines.get(i).startsWith(directive.getText() + " ")) {
	            insertIndex = i;
	        }
	    }
	    if (insertIndex == -1) {
	        for (int i = 0; i < lines.size(); i++) {
	            if (lines.get(i).startsWith("acl ")) {
	                insertIndex = i;
	            }
	        }
	    }
	    if (insertIndex == -1) {
	        lines.add(newLine);
	    } else {
	        lines.add(insertIndex + 1, newLine);
	    }
	    writeConfigLines(lines);
	}
	
	public List<String> listAclRules() throws IOException {
	    List<String> lines = readFile();
	    return lines.stream()
	            .map(String::trim)
	            .filter(line ->
	                    line.startsWith("acl ") ||
	                    line.startsWith("http_access ") ||
	                    line.startsWith("http_reply_access ") ||
	                    line.startsWith("url_rewrite_access ") ||
	                    line.startsWith("access_log "))
	            .collect(Collectors.toList());
	}
	
	public String findAclLineByName(String aclName) throws IOException {
	    List<String> lines = readFile();
	    for (String line : lines) {
	        if (line.startsWith("acl " + aclName + " ")) {
	            return line;
	        }
	    }
	    throw new ResourceNotFoundException("ACL com nome '" + aclName + "' não encontrada no arquivo.");
	}
	
	public String findAclDirective(String aclName, AclServiceDirective directive, AclServiceAction action) throws IOException {
	    String targetLine = aclService.buildAclDirectiveLine(aclName, directive, action);
	    List<String> lines = readFile();
	    for (String line : lines) {
	        if (line.trim().equals(targetLine.trim())) {
	            return line;
	        }
	    }
	    throw new ResourceNotFoundException("Diretiva '" + targetLine + "' não encontrada no arquivo.");
	}


	public void removeAclDirective(String aclName, AclServiceDirective directive, AclServiceAction action) throws IOException {
	    String targetLine = aclService.buildAclDirectiveLine(aclName, directive, action);
	    List<String> lines = readFile();
	    boolean directiveFound = false;
	    List<String> updatedLines = new ArrayList<>();
	    for (String line : lines) {
	        if (line.trim().equals(targetLine.trim())) {
	            directiveFound = true;
	            continue;
	        }
	        updatedLines.add(line);
	    }
	    if (!directiveFound) {
	    	throw new ResourceNotFoundException("Diretiva '" + targetLine + "' não encontrada no arquivo.");
	    }
	    writeConfigLines(updatedLines);
	}

	public void removeAllAclDirectivesByName(String aclName) throws IOException {
		List<String> lines = readFile();
		List<String> filtered = lines.stream().filter(line -> !line.matches(".*\\b" + aclName + "\\b.*"))
				.collect(Collectors.toList());
		writeConfigLines(filtered);
	}
}
