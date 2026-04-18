package com.paf.smartcampus.config;

import com.paf.smartcampus.entity.User;
import com.paf.smartcampus.repository.UserRepository;
import com.paf.smartcampus.security.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");

        String generatedUsername = email.split("@")[0] + "_" + System.currentTimeMillis();

        // Find or create user FIRST
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> userRepository.save(
                User.builder()
                    .email(email)
                    .name(oauthUser.getAttribute("name"))
                    .username(generatedUsername)
                    .provider("GOOGLE")
                    .role(User.Role.USER)
                    .build()
            ));

        // THEN generate token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // redirect
        response.sendRedirect("http://localhost:5174/smartcampus/oauth-success?token=" + token);
        
    }
}