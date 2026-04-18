package com.paf.smartcampus.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResourceResponseDTO {

    private Long id;
    private String name;
    private String type;
    private int capacity;
    private int availableCapacity;
    private String location;
    private String status;
}