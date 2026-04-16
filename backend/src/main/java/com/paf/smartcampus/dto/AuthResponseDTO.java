package com.paf.smartcampus.dto;

import lombok.Builder;
import lombok.Data;
import com.paf.smartcampus.entity.User;

@Data
@Builder
public class AuthResponseDTO {
    private String token;
    private User user;
}
