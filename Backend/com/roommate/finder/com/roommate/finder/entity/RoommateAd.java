package com.roommate.finder.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roommate_ads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoommateAd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 20)
    private String gender;

    private Integer age;

    @Column(length = 100)
    private String occupation;

    private Double budget;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "preferred_city", length = 150)
    private String preferredCity;

    @Column(name = "min_budget")
    private Double minBudget;

    @Column(name = "max_budget")
    private Double maxBudget;

    @Column(name = "room_type", length = 50)
    private String roomType;
}
