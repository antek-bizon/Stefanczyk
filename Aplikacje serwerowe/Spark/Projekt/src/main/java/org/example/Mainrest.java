package org.example;

import org.example.model.Photo;
import org.example.model.Photos;
import org.example.response.ResponseEntity;
import spark.Request;
import spark.Response;

import static spark.Spark.*;

public class Mainrest {
    static final Photos photos = new Photos();

    public static void main(String[] args) {
        port(7777);
        get("/test", (req, res) -> "test");
        get("/api/photos", Mainrest::getPhotos);
        get("/api/photos/:id", Mainrest::getPhotoById);
        get("/api/photos/photo/:name", Mainrest::getPhotoByName);
        delete("/api/photos/:id", Mainrest::deletePhoto);
        get("/api/photos/data/:id", Mainrest::getPhotoFile);
        put("/api/photos/:id", Mainrest::changePhotoFile);
    }

    private static String getPhotos(Request req, Response res) {
        var resEnt = new ResponseEntity<Photo[]>(res, photos::getPhotos);
        return resEnt.asJson();
    }

    private static String getPhotoById(Request req, Response res) {
        var id = req.params(":id");
        var resEnt = new ResponseEntity<Photo>(res, () -> photos.getPhotoById(id));
        return resEnt.asJson();
    }

    private static String getPhotoByName(Request req, Response res) {
        var name = req.params(":name");
        var resEnt = new ResponseEntity<Photo>(res, () -> photos.getPhotoByName(name));
        return resEnt.asJson();
    }

    private static String deletePhoto(Request req, Response res) {
        var id = req.params(":id");
        var resEnt = new ResponseEntity<Void>(res, () -> photos.deletePhoto(id));
        return resEnt.asJson();
    }

    private static String getPhotoFile(Request req, Response res) {
        var id = req.params(":id");
        var resEnt = new ResponseEntity<byte[]>(res, () -> photos.getPhotoFile(id));
        return resEnt.asImg();
    }

    private static String changePhotoFile(Request req, Response res) {
        var id = req.params(":id");
        var resEnt = new ResponseEntity<Photo>(res, () -> photos.renamePhoto(id, req.body()));
        return resEnt.asJson();
    }
}
