package com.example.photoserver.controller;

import com.example.photoserver.entity.PhotoFile;
import com.example.photoserver.service.PhotoFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/photo-files")
public class PhotoFileController {

    @Autowired
    private PhotoFileService photoFileService;

    @GetMapping
    public ResponseEntity<List<Long>> getAllPhotoFileIds() {
        List<Long> photoFiles = photoFileService.getAllPhotoFileIds();
        return ResponseEntity.ok().body(photoFiles);
    }

    @GetMapping("/{photoFileId}")
    public ResponseEntity<PhotoFile> getPhotoFileById(@PathVariable Long photoFileId) {
        PhotoFile photoFile = photoFileService.getPhotoFileById(photoFileId);
        return ResponseEntity.ok().body(photoFile);
    }

    @PostMapping
    public ResponseEntity<PhotoFile> createPhotoFile(@RequestBody PhotoFile photoFile) {
        PhotoFile createdPhotoFile = photoFileService.createPhotoFile(photoFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPhotoFile);
    }

    @PutMapping("/{photoFileId}")
    public ResponseEntity<PhotoFile> updatePhotoFile(@PathVariable Long photoFileId, @RequestBody PhotoFile photoFile) {
        PhotoFile updatedPhotoFile = photoFileService.updatePhotoFile(photoFileId, photoFile);
        if (updatedPhotoFile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(updatedPhotoFile);
    }

    @DeleteMapping("/{photoFileId}")
    public ResponseEntity<Void> deletePhotoFile(@PathVariable Long photoFileId) {
        photoFileService.deletePhotoFile(photoFileId);
        return ResponseEntity.noContent().build();
    }
}