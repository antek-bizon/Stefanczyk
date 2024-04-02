package com.example.photoserver.service;

import com.example.photoserver.entity.PhotoFile;
import com.example.photoserver.exception.classes.PictureNotFoundException;
import com.example.photoserver.repository.PhotoFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PhotoFileService {

    @Autowired
    private PhotoFileRepository photoFileRepository;

    public List<Long> getAllPhotoFileIds() {
        return photoFileRepository
                .findAll()
                .stream()
                .map(PhotoFile::getId)
                .toList();
    }

    public PhotoFile getPhotoFileById(Long photoFileId) {
        Optional<PhotoFile> photoFileOptional = photoFileRepository.findById(photoFileId);
        return photoFileOptional.orElseThrow(() -> new PictureNotFoundException(photoFileId));
    }

    public PhotoFile createPhotoFile(PhotoFile photoFile) {
        return photoFileRepository.save(photoFile);
    }

    public PhotoFile updatePhotoFile(Long photoFileId, PhotoFile photoFile) {
        if (!photoFileRepository.existsById(photoFileId)) {
            throw new PictureNotFoundException(photoFileId); // Photo file not found
        }
        photoFile.setId(photoFileId);
        return photoFileRepository.save(photoFile);
    }

    public void deletePhotoFile(Long photoFileId) {
        if (!photoFileRepository.existsById(photoFileId)) {
            throw new PictureNotFoundException(photoFileId); // Photo file not found
        }
        photoFileRepository.deleteById(photoFileId);
    }
}