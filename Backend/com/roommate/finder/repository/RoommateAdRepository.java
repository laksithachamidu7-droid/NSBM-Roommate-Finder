package com.roommate.finder.repository;

import com.roommate.finder.entity.RoommateAd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoommateAdRepository extends JpaRepository<RoommateAd, Long>, JpaSpecificationExecutor<RoommateAd> {
    Optional<RoommateAd> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
