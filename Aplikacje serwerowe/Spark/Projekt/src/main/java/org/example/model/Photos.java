package org.example.model;

import org.example.controller.PhotoService;
import org.example.response.NotFoundException;

import com.google.gson.Gson;

import java.io.File;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Objects;

public class Photos implements PhotoService {
    private final HashMap<String, Photo> photos = new HashMap<>();

    public Photos() {
        final String path = "upload";
        final File uploadFolder = new File(path);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }
        int i = 0;
        for (final File entry : Objects.requireNonNull(uploadFolder.listFiles())) {
            if (entry.isFile()) {
                String id = String.valueOf(i);
                photos.put(id, new Photo(id, entry.getName(), entry.getPath()));
                i += 1;
            }
        }
    }

    @Override
    public Photo[] getPhotos() {
        return photos.values().toArray(new Photo[0]);
    }

    @Override
    public Photo getPhotoById(String id) throws NotFoundException {
        Photo photo = photos.get(id);
        if (photo == null) {
            throw new NotFoundException("Photo with id " + id + " not found");
        }
        return photo;
    }

    @Override
    public Photo getPhotoByName(String name) throws NotFoundException {
        Photo foundPhoto = null;
        for (final Photo photo : photos.values()) {
            if (photo.getName().equals(name)) {
                foundPhoto = photo;
                break;
            }
        }
        if (foundPhoto == null) {
            throw new NotFoundException("Photo with name " + name + " not found");
        }
        return foundPhoto;
    }

    @Override
    public Void deletePhoto(String id) throws NotFoundException {
        if (!photos.containsKey(id)) {
            throw new NotFoundException("Photo with id " + id + " not found");
        }
        photos.remove(id);
        return null;
    }

    @Override
    public byte[] getPhotoFile(String id) throws RuntimeException {
        Photo photo = getPhotoById(id);
        try {
            return Files.readAllBytes(photo.getPath());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Photo renamePhoto(String id, String json) throws RuntimeException {
        Photo photo = getPhotoById(id);
        var gson = new Gson();
        String name = gson.fromJson(json, RenamePhotoJson.class).name;
        photo.setName(name);
        return photo;
    }

    static class RenamePhotoJson {
        String name;
    }
}
