package org.example;

import com.google.gson.Gson;
import spark.Request;
import spark.Response;

import java.util.ArrayList;

import static spark.Spark.*;

public class Main {
    static ArrayList<Car> cars = new ArrayList<Car>(10);
    static int nextId = 0;
    static Gson gson = new Gson();

    public static void main(String[] args) {
        init();
    }

    static void init() {
        port(4087);
        staticFiles.location("/public");
        get("/test", (req, res) -> "test");
        get("/add", Main::addCar);
    }

    static String addCar(Request req, Response res) {
        final var checkParams = req.queryParams();
        System.out.println(checkParams.toString());
        for (final var field : Car.getMandatoryFields()) {
            if (!checkParams.contains(field)) {
                return "Invalid data: missing field " + field;
            }
        }

        final var doors = Integer.parseInt(req.queryParams("doors"));
        final var model = req.queryParams("model");
        final var country =  req.queryParams("country");
        final var damaged = checkParams.contains("damaged");
        System.out.println(doors);
        cars.add(new Car(nextId++, doors, model, country, damaged));

        cars.forEach((e) -> {
            System.out.println(e.toString());
        });

        return "added";
    }
}

class Car {
    private int id;
    private int doors;

    private String model;
    private String country;

    private boolean damaged;

    private final static String[] mandatoryFields = {
        "doors", "model", "country"
    };
    Car(int id, int doors, String model, String country, boolean damaged) {
        this.id = id;
        this.doors = doors;
        this.model = model;
        this.country = country;
        this.damaged = damaged;
    }

    static String[] getMandatoryFields() {
        return mandatoryFields;
    }

    @Override
    public String toString() {
        var format = System.out.format("{ id: %d, doors: %d, model: %s, country: %s, damaged: %s }",
                id, doors, model, country, damaged);
        return format.toString();
    }
}