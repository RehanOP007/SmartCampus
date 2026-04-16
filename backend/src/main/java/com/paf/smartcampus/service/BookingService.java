package com.paf.smartcampus.service;

import com.paf.smartcampus.dto.BookingRequestDTO;
import com.paf.smartcampus.dto.BookingResponseDTO;
import com.paf.smartcampus.entity.Booking;
import com.paf.smartcampus.entity.Resource;
import com.paf.smartcampus.entity.User;
import com.paf.smartcampus.repository.BookingRepository;
import com.paf.smartcampus.repository.ResourceRepository;
import com.paf.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    // 🔥 Create Booking with conflict detection
    public BookingResponseDTO createBooking(BookingRequestDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Resource not found"));

        LocalDate date = LocalDate.parse(dto.getDate());
        LocalTime start = LocalTime.parse(dto.getStartTime());
        LocalTime end = LocalTime.parse(dto.getEndTime());

        // 🔥 Conflict check
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                        resource.getId(),
                        date,
                        end,
                        start
                );

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Time slot already booked!");
        }

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .date(date)
                .startTime(start)
                .endTime(end)
                .purpose(dto.getPurpose())
                .attendees(dto.getAttendees())
                .status(Booking.Status.PENDING)
                .build();

        return mapToDTO(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .resourceId(booking.getResource().getId())
                .date(booking.getDate().toString())
                .startTime(booking.getStartTime().toString())
                .endTime(booking.getEndTime().toString())
                .purpose(booking.getPurpose())
                .attendees(booking.getAttendees())
                .status(booking.getStatus().name())
                .build();
    }
}