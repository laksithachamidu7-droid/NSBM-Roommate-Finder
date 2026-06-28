package com.roommate.finder.controller;

import com.roommate.finder.dto.RoommateAdDto;
import com.roommate.finder.service.RoommateAdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/roommates")
@Validated
public class RoommateAdController {

    @Autowired
    private RoommateAdService roommateAdService;

    @GetMapping
    public ResponseEntity<List<RoommateAdDto>> searchRoommateAds(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String occupation,
            @RequestParam(required = false) String preferredCity,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) Double minBudget,
            @RequestParam(required = false) Double maxBudget) {
        List<RoommateAdDto> ads = roommateAdService.searchAds(
                gender, minAge, maxAge, occupation, preferredCity, roomType, minBudget, maxBudget);
        return ResponseEntity.ok(ads);
    }

    @PostMapping
    public ResponseEntity<RoommateAdDto> createRoommateAd(
            @Valid @RequestBody RoommateAdDto dto,
            Principal principal) {
        RoommateAdDto created = roommateAdService.createAd(dto, principal.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoommateAdDto> updateRoommateAd(
            @PathVariable Long id,
            @Valid @RequestBody RoommateAdDto dto,
            Principal principal) {
        RoommateAdDto updated = roommateAdService.updateAd(id, dto, principal.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoommateAd(@PathVariable Long id, Principal principal) {
        roommateAdService.deleteAd(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
