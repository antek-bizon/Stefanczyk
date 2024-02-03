package org.example;

import java.io.File;
import java.io.FileOutputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Random;
import java.util.UUID;

import com.fasterxml.uuid.Generators;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

class Car {
    private int id;
    private UUID uuid;
    private String model;
    private int year;
    private String color;
    private ArrayList<Airbag> airbags;
    private String pdfPath;
    private long date;
    private int price;
    private int tax;

    Car() {
        generateIds();
        setModel(generateRandomModel());
        setYear(generateRandomYear());
        setColor(generateRandomColor());
        setAirbags(generateRandomAirbags());
        setDate(generateRandomDate());
        setPrice(generateRandomPrice());
        setTax(generateRandomTax());
    }

    private void generateIds() {
        this.id = Main.nextId++;
        this.uuid = Generators.randomBasedGenerator().generate();
    }

    public void generateRest() {
        generateIds();
        setDate(generateRandomDate());
        setPrice(generateRandomPrice());
        setTax(generateRandomTax());
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

    private long generateRandomDate() {
        long startEpochDay = Instant.parse(String.valueOf(year) + "-01-01T00:00:00Z").toEpochMilli();
        long endEpochDay = Instant.parse(String.valueOf(year + 1) + "-01-01T00:00:00Z").toEpochMilli();
        Random random = new Random();
        long randomEpochDay = random.nextLong(startEpochDay, endEpochDay);
        return randomEpochDay;
    }

    private int generateRandomPrice() {
        Random random = new Random();
        return random.nextInt(100000) + 10000;
    }

    private int generateRandomTax() {
        int[] taxes = { 0, 7, 22 };
        Random random = new Random();
        return taxes[random.nextInt(taxes.length)];
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

    public long getDate() {
        return date;
    }

    public void setDate(long date) {
        this.date = date;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getTax() {
        return tax;
    }

    public void setTax(int tax) {
        this.tax = tax;
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
