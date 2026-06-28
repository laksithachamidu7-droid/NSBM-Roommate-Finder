package com.roommate.finder.controller;

import com.roommate.finder.dto.MessageDto;
import com.roommate.finder.dto.MessageRequest;
import com.roommate.finder.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@Validated
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(
            @Valid @RequestBody MessageRequest request,
            Principal principal) {
        MessageDto sent = messageService.sendMessage(request, principal.getName());
        return new ResponseEntity<>(sent, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MessageDto>> getMessages(
            @RequestParam(required = false) Long otherUserId,
            Principal principal) {
        if (otherUserId != null) {
            List<MessageDto> history = messageService.getChatHistory(otherUserId, principal.getName());
            return ResponseEntity.ok(history);
        } else {
            List<MessageDto> recent = messageService.getRecentMessages(principal.getName());
            return ResponseEntity.ok(recent);
        }
    }
}
