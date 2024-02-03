package org.example;

import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

import org.imgscalr.Scalr;
import org.imgscalr.Scalr.Rotation;

import com.google.gson.Gson;

public class Image {
    public static void modify(String path, String type, String data) throws Exception {
        switch (type) {
            case "crop": {
                var gson = new Gson();
                CropData cropData = gson.fromJson(data, CropData.class);
                crop(path, cropData);
                break;
            }
            case "rotate":
                rotate(path);
                break;
            case "flipHori":
                flip(path, Rotation.FLIP_HORZ);
                break;
            case "flipVert":
                flip(path, Rotation.FLIP_VERT);
                break;
            default:
                throw new Exception("Unknown type: " + type);
        }
    }

    public static void rotate(String path) throws IOException {
        BufferedImage originalImage = ImageIO.read(new File(path));
        BufferedImage rotatedImage = Scalr.rotate(originalImage, Scalr.Rotation.CW_90);

        save(rotatedImage, path);
    }

    public static void flip(String path, Rotation rotation) throws IOException {
        BufferedImage originalImage = ImageIO.read(new File(path));
        BufferedImage flippedImage = Scalr.rotate(originalImage, rotation);

        save(flippedImage, path);
    }

    public static void crop(String path, CropData data) throws IOException {
        BufferedImage originalImage = ImageIO.read(new File(path));
        data.scale(originalImage.getWidth());
        data.correct(originalImage.getWidth(), originalImage.getHeight());
        BufferedImage croppedImage = Scalr.crop(originalImage, data.x, data.y, data.width, data.height);

        save(croppedImage, path);
    }

    private static void save(BufferedImage image, String path) throws IOException {
        File outputImageFile = new File(path);
        ImageIO.write(image, "jpg", outputImageFile);
    }

    class CropData {
        public int x;
        public int y;
        public int width;
        public int height;
        public int webWidth;

        public void scale(int originalWidth) {
            float scale = Float.valueOf(originalWidth) / Float.valueOf(webWidth);
            x *= scale;
            y *= scale;
            width *= scale;
            height *= scale;
        }

        public void correct(int originalWidth, int originalHeight) {
            if (originalWidth < x + width) {
                width -= x + width - originalWidth;
            }
            if (originalHeight < y + height) {
                height -= y + height - originalHeight;
            }
        }
    }
}