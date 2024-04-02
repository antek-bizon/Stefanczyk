package com.example.photoserver.controller;

import com.example.photoserver.dto.LocationDTO;
import com.example.photoserver.entity.Location;
import com.example.photoserver.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<List<Long>> getLocationIds() {
        List<Long> locations = locationService.getLocationIds();
        return ResponseEntity.ok().body(locations);
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long locationId) {
        Location location = locationService.getLocationById(locationId);
        return ResponseEntity.ok().body(location);
    }

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody LocationDTO locationDTO) {
        Location location = new Location(locationDTO.getName(), locationDTO.getLatitude(), locationDTO.getLongitude());
        Location createdLocation = locationService.createLocation(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLocation);
    }

    @PutMapping("/{locationId}")
    public ResponseEntity<Location> updateLocation(@PathVariable Long locationId, @RequestBody LocationDTO locationDTO) {
        Location existingLocation = locationService.getLocationById(locationId);
        existingLocation.setName(locationDTO.getName());
        existingLocation.setLatitude(locationDTO.getLatitude());
        existingLocation.setLongitude(locationDTO.getLongitude());
        Location updatedLocation = locationService.updateLocation(locationId, existingLocation);
        return ResponseEntity.ok().body(updatedLocation);
    }

    @DeleteMapping("/{locationId}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long locationId) {
        locationService.deleteLocation(locationId);
        return ResponseEntity.noContent().build();
    }
}
