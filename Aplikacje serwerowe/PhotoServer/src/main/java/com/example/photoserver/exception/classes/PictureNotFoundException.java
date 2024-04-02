package com.example.photoserver.exception.classes;

public class PictureNotFoundException extends NotFoundException {
    public PictureNotFoundException(Long id) {
        super("Picture with id " + id + " was not found");
    }
}
