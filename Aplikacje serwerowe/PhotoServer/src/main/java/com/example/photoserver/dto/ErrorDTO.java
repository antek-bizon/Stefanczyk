package com.example.photoserver.dto;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class ErrorDTO {
    public static Map<String, String> errorObject(String message) {
        Date timestamp = new Date();
        Map<String, String> errorAttributes = new HashMap<>();
        errorAttributes.put("message", message);
        errorAttributes.put("timestamp", timestamp.toString());
        return errorAttributes;
    }
}
