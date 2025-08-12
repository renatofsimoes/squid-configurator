package com.squid_configurator.squidconfig.editor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.squid_configurator.squidconfig.model.BandWidthRule;
import com.squid_configurator.squidconfig.model.enums.BandWidthType;

public class BandWidthFileEditorTest {

    private Path tempFile;
    private BandWidthFileEditor editor;

    @BeforeEach
    void setup() throws IOException {
        tempFile = Files.createTempFile("squid", ".conf");
        editor = new BandWidthFileEditor(tempFile);
    }

    @AfterEach
    void cleanup() throws IOException {
        Files.deleteIfExists(tempFile);
    }

    @Test
    void testAddBandWidthRule() throws IOException {
        BandWidthRule rule = new BandWidthRule(BandWidthType.DELAY_POOLS, "1");
        editor.addBandWidthRule(rule);
        List<String> lines = Files.readAllLines(tempFile);
        assertTrue(lines.contains("delay_pools 1"));
    }

    @Test
    void testAddDuplicateBandWidthRuleException() throws IOException {
        BandWidthRule rule = new BandWidthRule(BandWidthType.DELAY_POOLS, "1");
        editor.addBandWidthRule(rule);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
            editor.addBandWidthRule(rule));
        assertEquals("Regra já existe no arquivo.", ex.getMessage());
    }

    @Test
    void testAddDelayClassWithoutDelayPoolsException() {
        BandWidthRule rule = new BandWidthRule(BandWidthType.DELAY_CLASS, "1 1");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
            editor.addBandWidthRule(rule));
        assertEquals("Não é possível adicionar 'delay_class' sem uma linha 'delay_pools'.", ex.getMessage());
    }

    @Test
    void testAddDuplicateDelayClassException() throws IOException {
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_POOLS, "1"));
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_CLASS, "1 1"));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
            editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_CLASS, "1 3")));
        assertEquals("Já existe uma linha 'delay_class' para o pool 1.", ex.getMessage());
    }

    @Test
    void testAddDelayParametersWithoutDelayClassException() throws IOException {
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_POOLS, "1"));
        BandWidthRule rule = new BandWidthRule(BandWidthType.DELAY_PARAMETERS, "1 512000/512000");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
            editor.addBandWidthRule(rule));
        assertEquals("Não é possível adicionar 'delay_parameters' sem uma linha 'delay_class'.", ex.getMessage());
    }

    @Test
    void testAddDuplicateDelayParametersException() throws IOException {
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_POOLS, "1"));
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_CLASS, "1 1"));
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_PARAMETERS, "1 512000/512000"));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
            editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_PARAMETERS, "1 312000/312000")));
        assertEquals("Já existe uma linha 'delay_parameters' para o pool 1.", ex.getMessage());
    }

    @Test
    void testAddDelaySequenceSuccess() throws IOException {
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_POOLS, "1"));
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_CLASS, "1 1"));
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_PARAMETERS, "1 512000/512000"));

        List<String> lines = Files.readAllLines(tempFile);
        assertTrue(lines.contains("delay_pools 1"));
        assertTrue(lines.contains("delay_class 1 1"));
        assertTrue(lines.contains("delay_parameters 1 512000/512000"));
    }

    @Test
    void testRemoveBandWidthRulesByPoolSuccess() throws IOException {
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_POOLS, "1"));
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_CLASS, "1 1"));
        editor.addBandWidthRule(new BandWidthRule(BandWidthType.DELAY_PARAMETERS, "1 512000/512000"));

        editor.removeBandWidthRulesByPool("1");

        List<String> lines = Files.readAllLines(tempFile);
        assertFalse(lines.stream().anyMatch(line -> line.startsWith("delay_")));
    }

    @Test
    void testRemoveBandWidthRulesByPoolNotFoundThrowsException() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
            editor.removeBandWidthRulesByPool("2"));
        assertEquals("Nenhuma regra encontrada para o pool 2", ex.getMessage());
    }
}

