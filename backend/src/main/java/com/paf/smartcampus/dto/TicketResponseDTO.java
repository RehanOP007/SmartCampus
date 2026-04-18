package com.paf.smartcampus.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TicketResponseDTO {
    private Long id;
    private String title;
    private String type;
    private String description;
    private String status;
    private Long createdBy;
    private Long assignedTo;
}
