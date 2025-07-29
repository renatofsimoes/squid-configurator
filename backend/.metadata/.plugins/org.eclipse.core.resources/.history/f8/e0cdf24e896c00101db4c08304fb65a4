package com.squid_configurator.squidconfig.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class SquidConfFileEditor {

	private final Path configFilePath;
	
	public SquidConfFileEditor(Path configFilePath) {
	    this.configFilePath = configFilePath;
	}

	protected List<String> readFile() throws IOException {
		return Files.readAllLines(configFilePath);
	}

	protected void writeConfigLines(List<String> lines) throws IOException {
		Files.write(configFilePath, lines);
	}
}
