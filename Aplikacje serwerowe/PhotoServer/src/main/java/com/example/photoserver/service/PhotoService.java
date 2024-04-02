package com.example.photoserver.service;

import com.example.photoserver.entity.Photo;
import com.example.photoserver.exception.classes.PictureNotFoundException;
import com.example.photoserver.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    public List<Long> getPhotoIds() {
        return photoRepository
                .findAll()
                .stream()
                .map(Photo::getPhotoId)
                .toList();
    }

    public Photo getPhotoById(Long photoId) {
        Optional<Photo> photoOptional = photoRepository.findById(photoId);
        return photoOptional.orElseThrow(() -> new PictureNotFoundException(photoId));
    }

    public Photo createPhoto(Photo photo) {
        return photoRepository.save(photo);
    }

    public Photo updatePhoto(Long photoId, Photo photo) {
        if (!photoRepository.existsById(photoId)) {
            throw new PictureNotFoundException(photoId);// Photo not found
        }
        photo.setPhotoId(photoId);
        return photoRepository.save(photo);
    }

    public void deletePhoto(Long photoId) {
        if (!photoRepository.existsById(photoId)) {
            throw new PictureNotFoundException(photoId); // Photo not found
        }
        photoRepository.deleteById(photoId);
    }
}
