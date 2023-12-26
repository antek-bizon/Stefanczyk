package org.example;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.jetbrains.annotations.NotNull;
import spark.Request;
import spark.Response;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import static spark.Spark.*;

public class Main {
    static int nextId = 0;
    static final ArrayList<Car> cars = new ArrayList<>(10);
    static final String staticFilesPath = System.getProperty("user.dir") + "/src/main/resources/public";
    static final Invoices invoices = new Invoices();

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
        post("/invoiceAll", Main::generateAllCarsInvoice);
        post("/invoiceByYear", Main::generateCarsByYearInvoice);
        post("/invoiceByPrice", Main::generateCarsByPriceInvoice);
        get("/invoiceAll", Main::getAllCarsInvoices);
        get("/invoiceByYear", Main::getCarsByYearInvoices);
        get("/invoiceByPrice", Main::getCarsByPriceInvoices);
    }

    private static String returnMsg(boolean success) {
        return success ? "{\"success\": true}" : "{\"success\": false}";
    }

    @org.jetbrains.annotations.NotNull
    private static String addCar(Request req, Response res) {
        try {
            var gson = new Gson();
            Car newCar = gson.fromJson(req.body(), Car.class);
            newCar.generateRest();
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
        var id = req.queryParams("id");
        var uuid = req.queryParams("uuid");
        var name = req.queryParams("name");
        String pdfPath = "";

        if (id != null && uuid != null) {
            var result = cars.stream().filter(car -> (car.checkIds(Integer.parseInt(id), uuid))).findAny();
            if (result.isEmpty()) {
                return returnMsg(false);
            }
            pdfPath = result.get().getPdfPath();
            if (pdfPath.isEmpty()) {
                return returnMsg(false);
            }
        } else if (name != null) {
            pdfPath = Main.staticFilesPath + "/pdfs/" + name;
        } else {
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

    private static String generateAllCarsInvoice(Request req, Response res) {
        invoices.addAllCars(new Invoice(cars));
        var gson = new Gson();
        return gson.toJson(invoices.getAllCars());
    }

    private static String generateCarsByYearInvoice(Request req, Response res) {
        var gson = new Gson();
        var data = gson.fromJson(req.body(), JsonObject.class).get("year");
        if (data.isJsonNull()) {
            return returnMsg(false);
        }
        var year = data.getAsInt();
        invoices.addCarsByYear(new Invoice(cars, year));
        return gson.toJson(invoices.getCarsByYear());
    }

    private static String generateCarsByPriceInvoice(Request req, Response res) {
        var gson = new Gson();
        var range = gson.fromJson(req.body(), Range.class);
        if (range == null) {
            return returnMsg(false);
        }
        invoices.addCarsByPrice(new Invoice(cars, range.from, range.to));
        return gson.toJson(invoices.getCarsByPrice());
    }

    private static String getAllCarsInvoices(Request req, Response res) {
        var gson = new Gson();
        return gson.toJson(invoices.getAllCars());
    }

    private static String getCarsByYearInvoices(Request req, Response res) {
        var gson = new Gson();
        return gson.toJson(invoices.getCarsByYear());
    }

    private static String getCarsByPriceInvoices(Request req, Response res) {
        var gson = new Gson();
        return gson.toJson(invoices.getCarsByPrice());
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

class Range {
    int from;
    int to;
}