package com.paf.smartcampus.controller;

import com.paf.smartcampus.dto.BookingRequestDTO;
import com.paf.smartcampus.dto.BookingResponseDTO;
import com.paf.smartcampus.entity.Booking;
import com.paf.smartcampus.service.BookingService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
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

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public BookingResponseDTO approveBooking(@PathVariable Long id) {
        return bookingService.updateStatus(id, Booking.Status.APPROVED);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public BookingResponseDTO rejectBooking(@PathVariable Long id) {
        return bookingService.updateStatus(id, Booking.Status.REJECTED);
    }

    @PutMapping("/{id}/status")
    public BookingResponseDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return bookingService.updateBookingStatus(id, status);
    }

    @PutMapping("/{id}/cancel")
    public BookingResponseDTO cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }

    @GetMapping("/resource/{id}")
    public List<BookingResponseDTO> getByResource(@PathVariable Long id) {
        return bookingService.getBookingsByResource(id);
    }
}