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
    static int nextId = 0;
    static ArrayList<Car> cars = new ArrayList<>(10);

    public static void main(String[] args) {
        init();
    }

    static void init() {
        port(4087);
        staticFiles.location("/public");
        get("/test", (req, res) -> "test");
        post("/add", Main::addCar);
        get("/json", Main::getJSON);
        post("/delete", Main::deleteCars);
        post("/update", Main::updateCars);
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
            return "failed";
        }
    }

    static String getJSON(Request req, Response res) {
        var gson = new Gson();
        return gson.toJson(cars);
    }

    static @NotNull String deleteCars(@NotNull Request req, Response res) {
        var gson = new Gson();
        String[] ids = gson.fromJson(req.body(), toDelete.class).ids;

        for (var id : ids) {
            for (var i = 0; i < cars.size(); i++) {
                if (Objects.equals(cars.get(i).getUuid().toString(), id)) {
                    cars.remove(i);
                    break;
                }
            }
        }

        return "deleted";
    }

    static @NotNull String updateCars(@NotNull Request req, Response res) {
        var gson = new Gson();
        Car[] updateInfo = gson.fromJson(req.body(), Car[].class);
        for (var info : updateInfo) {
            for (var car : cars) {
                if (car.getUuid() == info.getUuid()) {
                    car.update(info);
                    break;
                }
            }
        }
        return "updated";
    }
}

class Car {
    private int id;
    private UUID uuid;
    private String model;
    private int year;
    private String color;
    private ArrayList<Airbag> airbags;

    Car(){}

    public void generateIds() {
        this.id = Main.nextId++;
        this.uuid = Generators.randomBasedGenerator().generate();
    }

    public UUID getUuid() {
        return uuid;
    }

    public void update(@NotNull Car updateInfo) {
        model = updateInfo.model;
        color = updateInfo.color;
        year = updateInfo.year;
        airbags = updateInfo.airbags;
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
    String[] ids;
}