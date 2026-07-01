package com.roommate.finder.repository;

import com.roommate.finder.entity.SavedProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPropertyRepository extends JpaRepository<SavedProperty, Long> {
    List<SavedProperty> findByUserId(Long userId);
    Optional<SavedProperty> findByUserIdAndPropertyId(Long userId, Long propertyId);
    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);
}
