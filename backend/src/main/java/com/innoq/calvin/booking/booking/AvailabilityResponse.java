package com.innoq.calvin.booking.booking;

import java.util.List;

public record AvailabilityResponse(boolean available, List<BookingResponse> conflicts) {
}
