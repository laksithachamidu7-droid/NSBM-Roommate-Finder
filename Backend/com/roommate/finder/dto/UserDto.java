package com.roommate.finder.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profileImage;
    private String userType;
    private String companyName;
}
