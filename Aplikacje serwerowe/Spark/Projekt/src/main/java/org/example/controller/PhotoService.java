package org.example.controller;

import org.example.model.Photo;
import org.example.response.NotFoundException;

public interface PhotoService {
    Photo[] getPhotos();

    Photo getPhotoById(String id) throws NotFoundException;

    Photo getPhotoByName(String name) throws NotFoundException;

    Void deletePhoto(String id) throws NotFoundException;

    byte[] getPhotoFile(String id) throws RuntimeException;

    Photo renamePhoto(String id, String json) throws NotFoundException;
}
