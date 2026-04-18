package com.paf.smartcampus.controller;

import com.paf.smartcampus.dto.UserRequestDTO;
import com.paf.smartcampus.dto.UserResponseDTO;
import com.paf.smartcampus.entity.User;
import com.paf.smartcampus.repository.UserRepository;
import com.paf.smartcampus.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    //create
    @PostMapping
    public UserResponseDTO createUser(@RequestBody UserRequestDTO dto) {
        return userService.createUser(dto);
    }

    //get all
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    //Get user by ID
    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    //Update user
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id,
                                    @RequestBody UserRequestDTO dto) {
        return userService.updateUser(id, dto);
    }

    //Delete user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public User updateRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(User.Role.valueOf(role));
        return userRepository.save(user);
    }
}