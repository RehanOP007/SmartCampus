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
    private final NotificationService notificationService;

    private void sendNotification(Booking booking) {
        System.out.println("Notification: Booking " + booking.getId() +
                " status changed to " + booking.getStatus());
        }

    // Create Booking with conflict detection
    public BookingResponseDTO createBooking(BookingRequestDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Resource not found"));        

        LocalDate date = LocalDate.parse(dto.getDate());
        LocalTime start = LocalTime.parse(dto.getStartTime());
        LocalTime end = LocalTime.parse(dto.getEndTime());

        if (end.isBefore(start) || end.equals(start)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid time range");
        }

        // Conflict check
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

        if (dto.getAttendees() > resource.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendees exceed resource capacity");
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

    public BookingResponseDTO updateBooking(Long id, BookingRequestDTO dto) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        LocalDate date = LocalDate.parse(dto.getDate());
        LocalTime start = LocalTime.parse(dto.getStartTime());
        LocalTime end = LocalTime.parse(dto.getEndTime());

        if (end.isBefore(start) || end.equals(start)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid time range");
        }

        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                        booking.getResource().getId(),
                        date,
                        end,
                        start
                );

        // Ignore itself
        boolean hasConflict = conflicts.stream()
                .anyMatch(b -> !b.getId().equals(booking.getId()));

        if (hasConflict) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Time slot already booked!");
        }

        booking.setDate(date);
        booking.setStartTime(start);
        booking.setEndTime(end);
        booking.setPurpose(dto.getPurpose());
        booking.setAttendees(dto.getAttendees());

        return mapToDTO(bookingRepository.save(booking));
    }

    public BookingResponseDTO updateBookingStatus(Long id, String status) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        try {
                Booking.Status newStatus = Booking.Status.valueOf(status.toUpperCase());
                booking.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }

        Booking updated = bookingRepository.save(booking);

        // Trigger notification
        sendNotification(updated);

        return mapToDTO(updated);
    }

    public BookingResponseDTO updateStatus(Long id, Booking.Status status) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Booking not found"));

        Resource resource = resourceRepository.findById(booking.getResource().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));    
        
        int currentCapacity = resource.getAvailableCapacity();

        booking.setStatus(status);
        if(status == Booking.Status.APPROVED) {
                resource.setStatus(Resource.Status.BOOKED);
                resource.setAvailableCapacity(currentCapacity - booking.getAttendees());

        } else if (status == Booking.Status.REJECTED || status == Booking.Status.CANCELLED) {
                resource.setStatus(Resource.Status.AVAILABLE);
                
        }

        resourceRepository.save(resource);
        Booking saved = bookingRepository.save(booking);

        // SEND NOTIFICATION
        String message = "Your booking for " + booking.getResource().getName() +
                " on " + booking.getDate() + " is " + status.name();

        notificationService.sendNotification(booking.getUser(), message);

        // later: trigger notification here
        return mapToDTO(saved);
    }

    public BookingResponseDTO cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        
        Resource resource = resourceRepository.findById(booking.getResource().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        
        int currentCapacity = resource.getAvailableCapacity();

        booking.setStatus(Booking.Status.CANCELLED);
        resource.setAvailableCapacity(currentCapacity + booking.getAttendees());        

        if(resource.getStatus() == Resource.Status.MAINTENANCE) {

                String message = "Your booking for " + booking.getResource().getName() +
                " on " + booking.getDate() + " is cancelled due to maintenance.";

                notificationService.sendNotification(booking.getUser(), message);
        } else {
                resource.setStatus(Resource.Status.AVAILABLE);

                String message = "Your booking for " + booking.getResource().getName() +
                " on " + booking.getDate() + " is cancelled.";

                notificationService.sendNotification(booking.getUser(), message);
        }

        resourceRepository.save(resource);
        return mapToDTO(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<BookingResponseDTO> getBookingsByResource(Long resourceId) {
        return bookingRepository.findByResourceId(resourceId)
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