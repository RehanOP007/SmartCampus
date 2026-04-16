package com.paf.smartcampus.controller;

import com.paf.smartcampus.dto.BookingRequestDTO;
import com.paf.smartcampus.dto.BookingResponseDTO;
import com.paf.smartcampus.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponseDTO createBooking(@RequestBody BookingRequestDTO dto) {
        return bookingService.createBooking(dto);
    }

    @GetMapping
    public List<BookingResponseDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }
}