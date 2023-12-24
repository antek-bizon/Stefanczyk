package org.example;

import com.fasterxml.uuid.Generators;
import com.google.gson.Gson;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import org.jetbrains.annotations.NotNull;
import spark.Request;
import spark.Response;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Random;
import java.util.UUID;

import static spark.Spark.*;

public class Main {
    static int nextId = 0;
    static final ArrayList<Car> cars = new ArrayList<>(10);
    static final String staticFilesPath = System.getProperty("user.dir") + "/src/main/resources/public";

    public static void main(String[] args) {
        init();
    }

    private static void init() {
        staticFiles.externalLocation(staticFilesPath);
        port(4087);
        get("/test", (req, res) -> "test");

        post("/cars", Main::addCar);
        get("/cars", Main::getCarsJSON);
        delete("/cars", Main::deleteCars);
        put("/cars", Main::updateCars);

        post("/generate", Main::generateRandomCars);
        post("/invoice", Main::generateInvoice);
        get("/invoice", Main::sendInvoice);
    }

    private static String returnMsg(boolean success) {
        return success ? "{\"success\": true}" : "{\"success\": false}";
    }

    @org.jetbrains.annotations.NotNull
    private static String addCar(Request req, Response res) {
        try {
            var gson = new Gson();
            Car newCar = gson.fromJson(req.body(), Car.class);
            newCar.generateIds();
            cars.add(newCar);
            System.out.println(newCar);
            return gson.toJson(newCar);
        } catch (Exception e) {
            System.err.println(e);
            return returnMsg(false);
        }
    }

    private static String getCarsJSON(Request req, Response res) {
        var gson = new Gson();
        return gson.toJson(cars);
    }

    private static @NotNull String deleteCars(@NotNull Request req, Response res) {
        var gson = new Gson();
        var ids = gson.fromJson(req.body(), toDelete.class);

        var result = cars.removeIf(car -> (car.checkIds(ids.id, ids.uuid)));

        return returnMsg(result);
    }

    private static @NotNull String updateCars(@NotNull Request req, Response res) {
        var gson = new Gson();
        var updateInfo = gson.fromJson(req.body(), toUpdate.class);
        var result = cars.stream().filter(car -> (car.checkIds(updateInfo.id, updateInfo.uuid))).findAny();
        if (result.isEmpty()) {
            return returnMsg(false);
        }

        var carToUpdate = result.get();
        carToUpdate.setModel(updateInfo.model);
        carToUpdate.setYear(updateInfo.year);
        return returnMsg(true);
    }

    private static String generateRandomCars(Request req, Response res) {
        for (int i = 0; i < 100; i++) {
            Car car = new Car();
            cars.add(car);
        }

        var gson = new Gson();

        return gson.toJson(cars);
    }

    private static String generateInvoice(Request req, Response res) {
        try {
            System.out.println("Generate invoice");
            var gson = new Gson();
            var updateInfo = gson.fromJson(req.body(), toUpdate.class);
            var result = cars.stream().filter(car -> (car.checkIds(updateInfo.id, updateInfo.uuid))).findAny();
            if (result.isEmpty()) {
                return returnMsg(false);
            }

            var car = result.get();
            car.generatePdf();

            return gson.toJson(cars);
        } catch (Exception e) {
            e.printStackTrace();
            res.status(500);
            return returnMsg(false);
        }
    }

    private static String sendInvoice(Request req, Response res) {
        int id = Integer.parseInt(req.queryParams("id"));
        String uuid = req.queryParams("uuid");
        var result = cars.stream().filter(car -> (car.checkIds(id, uuid))).findAny();
        if (result.isEmpty()) {
            return returnMsg(false);
        }
        var pdfPath = result.get().getPdfPath();
        if (pdfPath.isEmpty()) {
            return returnMsg(false);
        }

        res.type("application/octet-stream"); //
        res.header("Content-Disposition", "attachment; filename=plik.pdf"); // nagłówek

        try {
            var outputStream = res.raw().getOutputStream();
            var path = Paths.get(pdfPath);
            outputStream.write(Files.readAllBytes(path));

            return returnMsg(true);
        } catch (Exception e) {
            e.printStackTrace();
            return returnMsg(false);
        }
    }
}

class Car {
    private int id;
    private UUID uuid;
    private String model;
    private int year;
    private String color;
    private ArrayList<Airbag> airbags;
    private String pdfPath;

    Car() {
        generateIds();
        setModel(generateRandomModel());
        setYear(generateRandomYear());
        setColor(generateRandomColor());
        setAirbags(generateRandomAirbags());
    }

    public void generateIds() {
        this.id = Main.nextId++;
        this.uuid = Generators.randomBasedGenerator().generate();
    }

    public int getId() {
        return id;
    }

    public UUID getUuid() {
        return uuid;
    }

    public boolean checkIds(int id, String uuid) {
        return (this.id == id && this.uuid.toString().equals(uuid));
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setYear(int year) {
        this.year = year;
    }

    private String generateRandomModel() {
        String[] models = { "Toyota", "Skoda", "KIA", "Volkswagen", "Hyundai", "BMW", "Mercedes-Benz", "Dacia", "Audi",
                "Ford" };
        Random random = new Random();
        return models[random.nextInt(models.length)];
    }

    private int generateRandomYear() {
        int[] years = { 2001, 2002, 2003, 2004, 2005, 2006 };
        Random random = new Random();
        return years[random.nextInt(years.length)];
    }

    private String generateRandomColor() {
        String[] colors = { "Red", "Blue", "Green", "White", "Black", "Silver", "Gray", "Yellow" };
        Random random = new Random();
        return colors[random.nextInt(colors.length)];
    }

    private ArrayList<Airbag> generateRandomAirbags() {
        ArrayList<Airbag> airbags = new ArrayList<>();
        airbags.add(new Airbag("Driver Airbag", new Random().nextBoolean()));
        airbags.add(new Airbag("Passenger Airbag", new Random().nextBoolean()));
        airbags.add(new Airbag("Side Airbags", new Random().nextBoolean()));
        airbags.add(new Airbag("Curtain Airbags", new Random().nextBoolean()));
        return airbags;
    }

    public void generatePdf() {
        Document document = new Document();
        String directoryPath = Main.staticFilesPath + "/pdfs/";
        String fileName = uuid + ".pdf";
        String filePath = directoryPath + fileName;

        try {
            // Create the directory if it doesn't exist
            File directory = new File(directoryPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            Font boldFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
            Font largeFont = new Font(Font.FontFamily.TIMES_ROMAN, 15, Font.NORMAL);
            Font colorFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.NORMAL, BaseColor.RED);

            // Add content to the PDF
            document.add(new Paragraph("Invoice for Car: " + uuid, boldFont));
            document.add(new Paragraph("Car Model: " + model, largeFont));
            document.add(new Paragraph("Car Year: " + year));
            document.add(new Paragraph("Color: " + color, colorFont));
            document.add(new Paragraph("Airbags:"));

            for (var airbag : airbags) {
                document.add(new Paragraph("\t" + airbag.name + ": " + String.valueOf(airbag.value)));
            }

            File imgFile = new File(Main.staticFilesPath + "/img/" + model + ".jpg");
            if (imgFile.exists()) {
                Image img = Image.getInstance(imgFile.getAbsolutePath());
                document.add(img);

            } else {
                document.add(new Paragraph("No image", largeFont));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            setPdfPath(filePath);
            if (document != null && document.isOpen()) {
                document.close();
            }
        }

    }

    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", uuid=" + uuid +
                ", model='" + model + '\'' +
                ", year=" + year +
                ", color='" + color + '\'' +
                ", airbags=" + airbags +
                '}';
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setAirbags(ArrayList<Airbag> airbags) {
        this.airbags = airbags;
    }

    public String getModel() {
        return model;
    }

    public int getYear() {
        return year;
    }

    public String getColor() {
        return color;
    }

    public ArrayList<Airbag> getAirbags() {
        return airbags;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }
}

class Airbag {
    final String name;
    final boolean value;

    Airbag(String name, boolean exits) {
        this.name = name;
        this.value = exits;
    }

    @Override
    public String toString() {
        return "Airbag{" +
                "name='" + name + '\'' +
                ", value=" + value +
                '}';
    }
}

class toDelete {
    int id;
    String uuid;
}

class toUpdate {
    int id;
    String uuid;
    String model;
    int year;
}