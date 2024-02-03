package org.example;

import java.io.File;
import java.io.FileOutputStream;
import java.time.Instant;
import java.util.ArrayList;

import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

public class Invoice {
    private String invoiceFilename;

    // Constructor for generating an invoice for all cars
    public Invoice(ArrayList<Car> cars) {
        generateAllCarsInvoice(cars);
    }

    // Constructor for generating an invoice for cars from a specific year
    public Invoice(ArrayList<Car> cars, int year) {
        generateCarsByYearInvoice(cars, year);
    }

    // Constructor for generating an invoice for cars within a specific price range
    public Invoice(ArrayList<Car> cars, int minPrice, int maxPrice) {
        generateCarsByPriceRangeInvoice(cars, minPrice, maxPrice);
    }

    public String getInvoiceFilename() {
        return invoiceFilename;
    }

    private void generateAllCarsInvoice(ArrayList<Car> cars) {
        generateInvoice("Invoice for all cars", "Combined Invoice for All Cars", cars);
    }

    private void generateCarsByYearInvoice(ArrayList<Car> cars, int year) {
        generateInvoice("Invoice for " + year, "Invoice for Cars from Year " + year,
                filterByYear(cars, year));
    }

    private void generateCarsByPriceRangeInvoice(ArrayList<Car> cars, int minPrice, int maxPrice) {
        generateInvoice("Invoice for prices" + minPrice + "-" + maxPrice,
                "Invoice for Cars within Price Range " + minPrice + " to " + maxPrice,
                filterByPriceRange(cars, minPrice, maxPrice));
    }

    private void generateInvoice(String fileName, String title, ArrayList<Car> selectedCars) {
        String date = String.valueOf(Instant.now().toEpochMilli());
        Document document = new Document();
        String directoryPath = Main.staticFilesPath + "/pdfs/";
        invoiceFilename = fileName + " - " + date + ".pdf";
        String absolutePath = directoryPath + invoiceFilename;

        try {
            File directory = new File(directoryPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            PdfWriter.getInstance(document, new FileOutputStream(absolutePath));
            document.open();

            Font boldFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
            Font largeFont = new Font(Font.FontFamily.TIMES_ROMAN, 15, Font.NORMAL);

            document.add(new Paragraph(title, largeFont));
            document.add(new Paragraph("Invoice Date: " + date, boldFont));

            PdfPTable table = new PdfPTable(6);
            table.setSpacingBefore(25);
            table.setSpacingAfter(25);
            table.addCell("Car ID");
            table.addCell("Car Model");
            table.addCell("Car Year");
            table.addCell("Netto");
            table.addCell("Tax");
            table.addCell("Brutto");

            var sum = 0;

            for (Car car : selectedCars) {
                table.addCell(String.valueOf(car.getId()));
                table.addCell(car.getModel());
                table.addCell(String.valueOf(car.getYear()));
                table.addCell(String.valueOf(car.getPrice()));
                table.addCell(String.valueOf(car.getTax()));
                float brutto = car.getPrice() + car.getPrice() * car.getTax() * 0.01f;
                table.addCell(String.valueOf(brutto));
                sum += car.getPrice();
            }
            document.add(table);
            document.add(new Paragraph("Sum: " + String.valueOf(sum), boldFont));
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (document != null && document.isOpen()) {
                document.close();
            }
        }
    }

    private ArrayList<Car> filterByYear(ArrayList<Car> cars, int year) {
        ArrayList<Car> filteredCars = new ArrayList<>();
        for (Car car : cars) {
            if (car.getYear() == year) {
                filteredCars.add(car);
            }
        }
        return filteredCars;
    }

    private ArrayList<Car> filterByPriceRange(ArrayList<Car> cars, int minPrice, int maxPrice) {
        ArrayList<Car> filteredCars = new ArrayList<>();
        for (Car car : cars) {
            if (car.getPrice() >= minPrice && car.getPrice() <= maxPrice) {
                filteredCars.add(car);
            }
        }
        return filteredCars;
    }
}