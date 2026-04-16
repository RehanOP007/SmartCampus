package com.paf.smartcampus.dto;

import lombok.Data;

@Data
public class ResourceRequestDTO {

    private String name;
    private String type;     // LAB / ROOM / EQUIPMENT
    private int capacity;
    private String location;
    private String status;   // ACTIVE / OUT_OF_SERVICE
}