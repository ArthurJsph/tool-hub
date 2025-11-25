package com.ferramentas.toolhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.cache.annotation.EnableCaching
public class ToolHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(ToolHubApplication.class, args);
	}

}
