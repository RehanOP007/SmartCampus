package com.paf.smartcampus.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.paf.smartcampus.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}