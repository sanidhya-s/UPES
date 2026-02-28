package com.upes.campuschat.controller;

import com.upes.campuschat.dto.UserSummary;
import com.upes.campuschat.entity.User;
import com.upes.campuschat.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private Long getCurrentUserId(Authentication auth) {
        return (Long) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<UserSummary>> getUsers(Authentication auth) {
        Long currentUserId = getCurrentUserId(auth);
        List<User> all = userRepository.findAll();
        return ResponseEntity.ok(all.stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(u -> new UserSummary(u.getId(), u.getName(), u.getEmail()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSummary> getUser(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(new UserSummary(user.getId(), user.getName(), user.getEmail()));
    }
}
