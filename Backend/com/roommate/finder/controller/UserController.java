package com.roommate.finder.controller;

import com.roommate.finder.dto.UserDto;
import com.roommate.finder.dto.UserProfileUpdate;
import com.roommate.finder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(Principal principal) {
        UserDto profile = userService.getCurrentUserProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UserProfileUpdate update, Principal principal) {
        UserDto updated = userService.updateUserProfile(principal.getName(), update);
        return ResponseEntity.ok(updated);
    }
}
