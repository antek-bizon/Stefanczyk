package com.example.photoserver.exception.classes;

public class LocationNotFoundException extends NotFoundException {
    public LocationNotFoundException(Long id) {
        super("Location with id " + id + " was not found");
    }
}
