package com.roommate.finder.service;

import com.roommate.finder.dto.DashboardStats;
import com.roommate.finder.repository.MessageRepository;
import com.roommate.finder.repository.PropertyRepository;
import com.roommate.finder.repository.RoommateAdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private RoommateAdRepository roommateAdRepository;

    @Autowired
    private MessageRepository messageRepository;

    public DashboardStats getDashboardStats() {
        return DashboardStats.builder()
                .totalProperties(propertyRepository.count())
                .totalRoommates(roommateAdRepository.count())
                .totalMessages(messageRepository.count())
                .build();
    }
}
