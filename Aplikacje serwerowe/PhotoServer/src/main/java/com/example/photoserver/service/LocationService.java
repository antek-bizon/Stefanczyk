package com.example.photoserver.service;

import com.example.photoserver.entity.Location;
import com.example.photoserver.exception.classes.LocationNotFoundException;
import com.example.photoserver.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public List<Long> getLocationIds() {
        return locationRepository
                .findAll()
                .stream()
                .map(Location::getLocationId)
                .toList();
    }

    public Location getLocationById(Long locationId) {
        Optional<Location> locationOptional = locationRepository.findById(locationId);
        return locationOptional.orElseThrow(() ->  new LocationNotFoundException(locationId)); // Location not found
    }

    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }

    public Location updateLocation(Long locationId, Location location) {
        if (!locationRepository.existsById(locationId)) {
            throw new LocationNotFoundException(locationId); // Location not found
        }
        location.setLocationId(locationId);
        return locationRepository.save(location);
    }

    public void deleteLocation(Long locationId) {
        if (!locationRepository.existsById(locationId)) {
            throw new LocationNotFoundException(locationId); // Location not found
        }
        locationRepository.deleteById(locationId);
    }
}
