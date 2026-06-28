package com.roommate.finder.dto;

import jakarta.validation.constraints.Min;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoommateAdDto {
    private Long id;
    private UserDto user;
    private String gender;
    
    @Min(value = 0, message = "Age must be positive")
    private Integer age;
    
    private String occupation;
    private Double budget;
    private String bio;
    
    private String preferredCity;
    private Double minBudget;
    private Double maxBudget;
    private String roomType;
}
