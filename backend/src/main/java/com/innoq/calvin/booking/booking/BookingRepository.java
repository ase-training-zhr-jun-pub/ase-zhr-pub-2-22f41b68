package com.innoq.calvin.booking.booking;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<BookingEntity, String> {

	List<BookingEntity> findByRoomIdAndDateAndStatus(String roomId, LocalDate date, BookingStatus status);

	List<BookingEntity> findByLocationIdAndDateAndStatus(String locationId, LocalDate date, BookingStatus status);

	List<BookingEntity> findByEmployeeAndStatusOrderByDateAscStartTimeAsc(String employee, BookingStatus status);

	List<BookingEntity> findByRoomIdAndDateOrderByStartTimeAsc(String roomId, LocalDate date);
}
