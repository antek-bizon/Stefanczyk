package org.example;

import java.util.ArrayList;

public class Invoices {
    private ArrayList<Invoice> allCars = new ArrayList<>(5);
    private ArrayList<Invoice> carsByYear = new ArrayList<>(5);
    private ArrayList<Invoice> carsByPrice = new ArrayList<>(5);

    public ArrayList<Invoice> getAllCars() {
        return allCars;
    }

    public void addAllCars(Invoice invoice) {
        this.allCars.add(invoice);
    }

    public ArrayList<Invoice> getCarsByYear() {
        return carsByYear;
    }

    public void addCarsByYear(Invoice invoice) {
        this.carsByYear.add(invoice);
    }

    public ArrayList<Invoice> getCarsByPrice() {
        return carsByPrice;
    }

    public void addCarsByPrice(Invoice invoice) {
        this.carsByPrice.add(invoice);
    }
}
