package com.paf.smartcampus.controller;

import com.paf.smartcampus.dto.*;
import com.paf.smartcampus.entity.User;
import com.paf.smartcampus.repository.UserRepository;
import com.paf.smartcampus.security.JwtUtil;
import com.paf.smartcampus.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public AuthResponseDTO register(@RequestBody UserRequestDTO request) {
        return authService.register(request);
    }

    // LOGIN
    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }

    // GOOGLE SUCCESS
    @GetMapping("/success")
    public void loginSuccess(HttpServletResponse response,
                             @AuthenticationPrincipal OAuth2User oauthUser) throws IOException {

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String generatedUsername = email.split("@")[0] + "_" + System.currentTimeMillis();

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(email)
                                .name(name)
                                .username(generatedUsername)
                                .password(null)
                                .role(User.Role.USER)
                                .provider("GOOGLE")
                                .build()
                ));

        String token = jwtUtil.generateToken(email);

        // redirect to React
        response.sendRedirect("http://localhost:5174/smartcampus/oauth-success?token=" + token);
    }
}