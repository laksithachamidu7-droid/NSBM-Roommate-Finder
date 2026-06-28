package com.roommate.finder.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {
    private Long id;
    private UserDto sender;
    private UserDto receiver;
    private String message;
    private LocalDateTime createdAt;
}
