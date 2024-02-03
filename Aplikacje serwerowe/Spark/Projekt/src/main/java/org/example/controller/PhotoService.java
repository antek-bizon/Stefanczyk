package org.example.controller;

import org.example.model.Photo;
import org.example.response.NotFoundException;

import java.io.OutputStream;

public interface PhotoService {
    Photo[] getPhotos();
    Photo getPhotoById(String id) throws NotFoundException;
    Photo getPhotoByName(String name) throws NotFoundException;
    void deletePhoto(String id) throws NotFoundException;
    byte[] getPhotoFile(String id) throws Exception;

}
