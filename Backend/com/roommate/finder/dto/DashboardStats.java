package com.roommate.finder.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalProperties;
    private long totalRoommates;
    private long totalMessages;
}
