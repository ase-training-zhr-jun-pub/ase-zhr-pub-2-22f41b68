package com.innoq.calvin.booking.location;

public record LocationResponse(String id, String name, String city, String country, String abbreviation, String address,
		boolean headquarters, long roomCount) {
}
