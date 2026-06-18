package com.innoq.calvin.booking.room;

import java.util.List;

public record RoomResponse(String id, String name, String locationId, int capacity, String floorInfo, int areaSqm,
		String description, String color, List<String> equipmentIds) {
}
