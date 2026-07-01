package com.roommate.finder.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedPropertyDto {
    private Long id;
    private UserDto user;
    private PropertyDto property;
}
