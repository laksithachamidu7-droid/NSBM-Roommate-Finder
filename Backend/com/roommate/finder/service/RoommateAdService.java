package com.roommate.finder.service;

import com.roommate.finder.dto.RoommateAdDto;
import com.roommate.finder.entity.RoommateAd;
import com.roommate.finder.entity.User;
import com.roommate.finder.exception.ResourceNotFoundException;
import com.roommate.finder.exception.UnauthorizedException;
import com.roommate.finder.repository.RoommateAdRepository;
import com.roommate.finder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoommateAdService {

    @Autowired
    private RoommateAdRepository roommateAdRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public RoommateAdDto createAd(RoommateAdDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (roommateAdRepository.existsByUserId(user.getId())) {
            throw new IllegalArgumentException("User already has a roommate advertisement!");
        }

        RoommateAd ad = RoommateAd.builder()
                .user(user)
                .gender(dto.getGender())
                .age(dto.getAge())
                .occupation(dto.getOccupation())
                .budget(dto.getBudget())
                .bio(dto.getBio())
                .preferredCity(dto.getPreferredCity())
                .minBudget(dto.getMinBudget())
                .maxBudget(dto.getMaxBudget())
                .roomType(dto.getRoomType())
                .build();

        RoommateAd saved = roommateAdRepository.save(ad);
        return mapToDto(saved);
    }

    public RoommateAdDto updateAd(Long id, RoommateAdDto dto, String userEmail) {
        RoommateAd ad = roommateAdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roommate Ad not found"));

        if (!ad.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedException("You are not authorized to update this advertisement");
        }

        ad.setGender(dto.getGender());
        ad.setAge(dto.getAge());
        ad.setOccupation(dto.getOccupation());
        ad.setBudget(dto.getBudget());
        ad.setBio(dto.getBio());
        ad.setPreferredCity(dto.getPreferredCity());
        ad.setMinBudget(dto.getMinBudget());
        ad.setMaxBudget(dto.getMaxBudget());
        ad.setRoomType(dto.getRoomType());

        RoommateAd updated = roommateAdRepository.save(ad);
        return mapToDto(updated);
    }

    public void deleteAd(Long id, String userEmail) {
        RoommateAd ad = roommateAdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roommate Ad not found"));

        if (!ad.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedException("You are not authorized to delete this advertisement");
        }

        roommateAdRepository.delete(ad);
    }

    public List<RoommateAdDto> searchAds(String gender, Integer minAge, Integer maxAge, String occupation, 
                                         String preferredCity, String roomType, Double minBudget, Double maxBudget) {
        Specification<RoommateAd> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (gender != null && !gender.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("gender")), gender.toLowerCase()));
            }
            if (minAge != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("age"), minAge));
            }
            if (maxAge != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("age"), maxAge));
            }
            if (occupation != null && !occupation.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("occupation")), "%" + occupation.toLowerCase() + "%"));
            }
            if (preferredCity != null && !preferredCity.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("preferredCity")), "%" + preferredCity.toLowerCase() + "%"));
            }
            if (roomType != null && !roomType.trim().isEmpty() && !roomType.equalsIgnoreCase("Any")) {
                predicates.add(cb.equal(cb.lower(root.get("roomType")), roomType.toLowerCase()));
            }
            if (minBudget != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("minBudget"), minBudget));
            }
            if (maxBudget != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("maxBudget"), maxBudget));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return roommateAdRepository.findAll(spec).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public RoommateAdDto mapToDto(RoommateAd ad) {
        if (ad == null) return null;
        return RoommateAdDto.builder()
                .id(ad.getId())
                .user(userService.mapToDto(ad.getUser()))
                .gender(ad.getGender())
                .age(ad.getAge())
                .occupation(ad.getOccupation())
                .budget(ad.getBudget())
                .bio(ad.getBio())
                .preferredCity(ad.getPreferredCity())
                .minBudget(ad.getMinBudget())
                .maxBudget(ad.getMaxBudget())
                .roomType(ad.getRoomType())
                .build();
    }
}
