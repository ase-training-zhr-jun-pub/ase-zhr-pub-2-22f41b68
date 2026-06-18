package com.innoq.calvin.booking.booking;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;

public record BookingResponse(String id, String roomId, String locationId, String employee, LocalDate date,
		@JsonFormat(pattern = "HH:mm") LocalTime startTime, @JsonFormat(pattern = "HH:mm") LocalTime endTime,
		String title, String note, BookingStatus status, String roomName, String locationName) {
}
