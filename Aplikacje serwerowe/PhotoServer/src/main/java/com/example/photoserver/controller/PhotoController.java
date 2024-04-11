package com.example.photoserver.controller;

import com.example.photoserver.entity.Photo;
import com.example.photoserver.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {
    @Autowired
    private PhotoService photoService;

    @GetMapping
    public ResponseEntity<List<Long>> getPhotoIds() {
        List<Long> ids = photoService.getPhotoIds();
        return ResponseEntity.ok().body(ids);
    }

    @GetMapping("/{photoId}")
    public ResponseEntity<Photo> getPhotoById(@PathVariable Long photoId) {
        Photo photo = photoService.getPhotoById(photoId);
        return ResponseEntity.ok().body(photo);
    }

    @PostMapping
    public ResponseEntity<Photo> createPhoto(@RequestBody Photo photo) {
        Photo createdPhoto = photoService.createPhoto(photo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPhoto);
    }

    @PutMapping("/{photoId}")
    public ResponseEntity<Photo> updatePhoto(@PathVariable Long photoId, @RequestBody Photo photo) {
        Photo updatedPhoto = photoService.updatePhoto(photoId, photo);
        return ResponseEntity.ok().body(updatedPhoto);
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long photoId) {
        photoService.deletePhoto(photoId);
        return ResponseEntity.noContent().build();
    }
}
