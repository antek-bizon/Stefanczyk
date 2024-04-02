package com.example.photoserver.exception.classes;

public class PhotoFileNotFoundException extends NotFoundException {
    public PhotoFileNotFoundException(Long id) {
        super("Photo file with id " + id + " was not found");
    }
}
