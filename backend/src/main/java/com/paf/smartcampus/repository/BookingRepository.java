package com.paf.smartcampus.repository;

import com.paf.smartcampus.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 🔥 Find overlapping bookings
    List<Booking> findByResourceIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Long resourceId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime
    );
}