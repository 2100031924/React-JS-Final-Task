package com.ecommerce.controller;

import com.ecommerce.dto.ProfileUpdateRequest;
import com.ecommerce.dto.UserResponse;
import com.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<UserResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }
    
    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }
    
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@RequestBody Map<String, String> passwords) {
        userService.changePassword(
                passwords.get("currentPassword"),
                passwords.get("newPassword")
        );
        return ResponseEntity.ok().build();
    }
}
