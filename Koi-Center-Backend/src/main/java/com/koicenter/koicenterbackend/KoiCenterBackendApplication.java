package com.koicenter.koicenterbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class KoiCenterBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(KoiCenterBackendApplication.class, args);
	}

}
