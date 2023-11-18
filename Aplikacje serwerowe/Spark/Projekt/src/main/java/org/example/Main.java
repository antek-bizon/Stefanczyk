package org.example;

import com.fasterxml.uuid.Generators;
import com.google.gson.Gson;
import org.jetbrains.annotations.NotNull;
import spark.Request;
import spark.Response;

import java.util.ArrayList;
import java.util.Objects;
import java.util.UUID;

import static spark.Spark.*;
import static spark.Spark.get;

public class Main {
    static int nextId = 1;
    static ArrayList<Car> cars = new ArrayList<>(10);

    public static void main(String[] args) {
        init();
    }

    static void init() {
        var projectDir = System.getProperty("user.dir");
        var staticDir = "/src/main/resources/public";
        staticFiles.externalLocation(projectDir + staticDir);
        port(4087);
        get("/test", (req, res) -> "test");
        post("/cars", Main::addCar);
        get("/cars", Main::getCarsJSON);
        delete("/cars", Main::deleteCars);
        put("/cars", Main::updateCars);
    }

    static String returnMsg(boolean success) {
        return success ? "{\"success\": true}" : "{\"success\": false}";
    }

    @org.jetbrains.annotations.NotNull
    static String addCar(Request req, Response res) {
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

    static String getCarsJSON(Request req, Response res) {
        var gson = new Gson();
        return gson.toJson(cars);
    }

    static @NotNull String deleteCars(@NotNull Request req, Response res) {
        var gson = new Gson();
        var ids = gson.fromJson(req.body(), toDelete.class);

        var result = cars.removeIf(car -> (car.checkIds(ids.id, ids.uuid)));

        return returnMsg(result);
    }

    static @NotNull String updateCars(@NotNull Request req, Response res) {
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
}

class Car {
    private int id;
    private UUID uuid;
    private String model;
    private int year;
    private String color;
    private ArrayList<Airbag> airbags;

    Car() {
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