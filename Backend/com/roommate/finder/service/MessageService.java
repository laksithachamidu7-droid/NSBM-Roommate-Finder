package com.roommate.finder.service;

import com.roommate.finder.dto.MessageDto;
import com.roommate.finder.dto.MessageRequest;
import com.roommate.finder.entity.Message;
import com.roommate.finder.entity.User;
import com.roommate.finder.exception.ResourceNotFoundException;
import com.roommate.finder.repository.MessageRepository;
import com.roommate.finder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public MessageDto sendMessage(MessageRequest request, String senderEmail) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Sender user not found"));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver user not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .message(request.getMessage())
                .build();

        Message saved = messageRepository.save(message);
        return mapToDto(saved);
    }

    public List<MessageDto> getChatHistory(Long otherUserId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!userRepository.existsById(otherUserId)) {
            throw new ResourceNotFoundException("Chat participant user not found");
        }

        return messageRepository.findChatHistory(user.getId(), otherUserId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<MessageDto> getRecentMessages(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return messageRepository.findAllMessagesForUser(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public MessageDto mapToDto(Message m) {
        if (m == null) return null;
        return MessageDto.builder()
                .id(m.getId())
                .sender(userService.mapToDto(m.getSender()))
                .receiver(userService.mapToDto(m.getReceiver()))
                .message(m.getMessage())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
