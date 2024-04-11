package com.example.photoserver.exception.classes;

public class NotConfirmedException extends RuntimeException {
    public NotConfirmedException() {
        super("User is not confirmed");
    }
}
