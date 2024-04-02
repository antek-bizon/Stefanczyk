package com.example.photoserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class PhotoServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(PhotoServerApplication.class, args);
    }
}
