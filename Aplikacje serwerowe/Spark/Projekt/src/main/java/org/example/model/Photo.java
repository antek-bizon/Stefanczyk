package org.example.model;

import java.nio.file.Path;
import java.nio.file.Paths;

public class Photo {
    private String id;
    private String name;
    private String path;

    Photo(String id, String name, String path) {
        this.id = id;
        this.name = name;
        this.path = path;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Path getPath() {
        return Paths.get(path);
    }

    public void setPath(String path) {
        this.path = path;
    }
}
