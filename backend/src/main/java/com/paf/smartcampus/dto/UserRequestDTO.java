package com.paf.smartcampus.dto;

import lombok.Data;

@Data
public class UserRequestDTO {

    private String name;
    private String email;
    private String username;
    private String password;    
    private String role; // USER / ADMIN / TECHNICIAN
}