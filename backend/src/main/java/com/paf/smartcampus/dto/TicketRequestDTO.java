package com.paf.smartcampus.dto;

import lombok.Data;

@Data
public class TicketRequestDTO {
    private String title;
    private String type;
    private Long resourceId;
    private String description;
}
