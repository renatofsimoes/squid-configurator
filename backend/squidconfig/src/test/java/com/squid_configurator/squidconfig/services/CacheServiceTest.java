package com.squid_configurator.squidconfig.services;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.squid_configurator.squidconfig.model.CacheRule;
import com.squid_configurator.squidconfig.model.enums.CacheType;

public class CacheServiceTest {
	private CacheService cacheService;
	
	@BeforeEach
	void setUp() {
		cacheService = new CacheService();
	}
	
	
	@Test
	void buildBandWidthLineTest() {
		CacheRule rule = new CacheRule(CacheType.CACHE_MEM, "256 MB");
		String result = cacheService.buildCacheLine(rule);
		assertEquals("cache_mem 256 MB", result);
	}

}
