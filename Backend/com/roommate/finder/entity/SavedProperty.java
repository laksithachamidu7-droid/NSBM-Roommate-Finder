package com.roommate.finder.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saved_properties", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "property_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
}
