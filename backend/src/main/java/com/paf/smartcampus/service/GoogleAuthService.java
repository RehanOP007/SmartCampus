package com.paf.smartcampus.service;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.paf.smartcampus.entity.User;
import com.paf.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final UserRepository userRepository;

    private static final String CLIENT_ID = "836180986737-q5s48m36q06n79mlknicqtkp30pg8mda.apps.googleusercontent.com";

    public User verifyToken(String idTokenString) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {

                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");

                // 🔥 Check if user exists
                return userRepository.findAll().stream()
                        .filter(u -> u.getEmail().equals(email))
                        .findFirst()
                        .orElseGet(() -> {
                            User newUser = User.builder()
                                    .email(email)
                                    .name(name)
                                    .role(User.Role.USER)
                                    .build();

                            return userRepository.save(newUser);
                        });

            } else {
                throw new RuntimeException("Invalid Google token");
            }

        } catch (Exception e) {
            throw new RuntimeException("Authentication failed");
        }
    }
}