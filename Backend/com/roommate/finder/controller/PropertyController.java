package com.roommate.finder.controller;

import com.roommate.finder.dto.PropertyDto;
import com.roommate.finder.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@Validated
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<PropertyDto>> getAllProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Integer bathrooms) {
        List<PropertyDto> properties = propertyService.getAllProperties(city, maxRent, bedrooms, bathrooms);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        PropertyDto property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(@Valid @RequestBody PropertyDto dto, Principal principal) {
        PropertyDto created = propertyService.createProperty(dto, principal.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDto dto,
            Principal principal) {
        PropertyDto updated = propertyService.updateProperty(id, dto, principal.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id, Principal principal) {
        propertyService.deleteProperty(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/saved")
    public ResponseEntity<List<PropertyDto>> getSavedProperties(Principal principal) {
        List<PropertyDto> saved = propertyService.getSavedProperties(principal.getName());
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Void> saveProperty(@PathVariable Long id, Principal principal) {
        propertyService.saveProperty(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<Void> removeSavedProperty(@PathVariable Long id, Principal principal) {
        propertyService.removeSavedProperty(id, principal.getName());
        return ResponseEntity.ok().build();
    }
}
