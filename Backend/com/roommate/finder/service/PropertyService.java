package com.roommate.finder.service;

import com.roommate.finder.dto.PropertyDto;
import com.roommate.finder.entity.Property;
import com.roommate.finder.entity.SavedProperty;
import com.roommate.finder.entity.User;
import com.roommate.finder.exception.ResourceNotFoundException;
import com.roommate.finder.exception.UnauthorizedException;
import com.roommate.finder.repository.PropertyRepository;
import com.roommate.finder.repository.SavedPropertyRepository;
import com.roommate.finder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service 
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SavedPropertyRepository savedPropertyRepository;

    @Autowired
    private UserService userService;

    public PropertyDto createProperty(PropertyDto dto, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Property property = Property.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .address(dto.getAddress())
                .city(dto.getCity())
                .rent(dto.getRent())
                .bedrooms(dto.getBedrooms())
                .bathrooms(dto.getBathrooms())
                .images(dto.getImages())
                .archived(false)
                .owner(owner)
                .build();

        Property saved = propertyRepository.save(property);
        return mapToDto(saved);
    }

    public PropertyDto updateProperty(Long id, PropertyDto dto, String ownerEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!property.getOwner().getEmail().equalsIgnoreCase(ownerEmail)) {
            throw new UnauthorizedException("You are not authorized to update this property");
        }

        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setAddress(dto.getAddress());
        property.setCity(dto.getCity());
        property.setRent(dto.getRent());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setImages(dto.getImages());

        Property updated = propertyRepository.save(property);
        return mapToDto(updated);
    }

    public void deleteProperty(Long id, String ownerEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!property.getOwner().getEmail().equalsIgnoreCase(ownerEmail)) {
            throw new UnauthorizedException("You are not authorized to delete this property");
        }

        propertyRepository.delete(property);
    }

    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        return mapToDto(property);
    }

    public List<PropertyDto> getAllProperties(String city, Double maxRent, Integer bedrooms, Integer bathrooms) {
        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (city != null && !city.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%"));
            }
            if (maxRent != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("rent"), maxRent));
            }
            if (bedrooms != null) {
                predicates.add(cb.equal(root.get("bedrooms"), bedrooms));
            }
            if (bathrooms != null) {
                predicates.add(cb.equal(root.get("bathrooms"), bathrooms));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return propertyRepository.findAll(spec).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveProperty(Long propertyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (savedPropertyRepository.existsByUserIdAndPropertyId(user.getId(), propertyId)) {
            return;
        }

        SavedProperty savedProperty = SavedProperty.builder()
                .user(user)
                .property(property)
                .build();

        savedPropertyRepository.save(savedProperty);
    }

    @Transactional
    public void removeSavedProperty(Long propertyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SavedProperty savedProperty = savedPropertyRepository.findByUserIdAndPropertyId(user.getId(), propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved property reference not found"));

        savedPropertyRepository.delete(savedProperty);
    }

    public List<PropertyDto> getSavedProperties(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return savedPropertyRepository.findByUserId(user.getId()).stream()
                .map(SavedProperty::getProperty)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PropertyDto mapToDto(Property p) {
        if (p == null) return null;
        return PropertyDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .address(p.getAddress())
                .city(p.getCity())
                .rent(p.getRent())
                .bedrooms(p.getBedrooms())
                .bathrooms(p.getBathrooms())
                .images(p.getImages())
                .archived(p.isArchived())
                .owner(userService.mapToDto(p.getOwner()))
                .build();
    }
}
