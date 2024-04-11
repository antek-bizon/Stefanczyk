package com.example.photoserver.exception;

import com.example.photoserver.dto.response.MainDTO;
import com.example.photoserver.exception.classes.NotConfirmedException;
import com.example.photoserver.exception.classes.NotFoundException;
import com.example.photoserver.security.jwt.AuthEntryPointJwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleLocationNotFoundException(NotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(MainDTO.object(HttpStatus.NOT_FOUND, ex.getMessage()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(MainDTO.object(HttpStatus.UNAUTHORIZED, ex.getMessage()));
    }

    @ExceptionHandler(NotConfirmedException.class)
    public ResponseEntity<Object> handleNotConfirmedException(NotConfirmedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(MainDTO.object(HttpStatus.FORBIDDEN, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(Exception ex) {
        logger.error(ex.toString());
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(MainDTO.object(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage()));
    }
}
