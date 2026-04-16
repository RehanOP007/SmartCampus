package com.paf.smartcampus.dto;

import lombok.Data;

@Data
public class BookingRequestDTO {

    private Long userId;
    private Long resourceId;

    private String date;       // "2026-04-02"
    private String startTime;  // "10:00"
    private String endTime;    // "12:00"

    private String purpose;
    private int attendees;
}