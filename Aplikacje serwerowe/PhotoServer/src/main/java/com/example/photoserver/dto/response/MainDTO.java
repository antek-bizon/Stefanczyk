package com.example.photoserver.dto.response;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;

public class MainDTO {
    public static Map<String, Object> object(HttpStatus status, String details) {
        Map<String, Object> errorAttributes = new HashMap<>();
        errorAttributes.put("title", status.getReasonPhrase());
        errorAttributes.put("status", status.value());
        errorAttributes.put("details", details);
        return errorAttributes;
    }
}
