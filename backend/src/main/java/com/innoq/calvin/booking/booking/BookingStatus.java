package com.innoq.calvin.booking.booking;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BookingStatus {
	CONFIRMED("confirmed"), CANCELLED("cancelled");

	private final String value;

	BookingStatus(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}

	@JsonCreator
	public static BookingStatus fromValue(String value) {
		for (BookingStatus s : values()) {
			if (s.value.equals(value))
				return s;
		}
		throw new IllegalArgumentException("Unknown booking status: " + value);
	}
}
