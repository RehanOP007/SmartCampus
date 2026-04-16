package com.paf.smartcampus.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponseDTO {

    private Long id;
    private Long userId;
    private Long resourceId;

    private String date;
    private String startTime;
    private String endTime;

    private String purpose;
    private int attendees;
    private String status;
}