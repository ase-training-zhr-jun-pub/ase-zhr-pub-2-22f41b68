package com.innoq.calvin.booking.booking;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

	@Mapping(target = "roomName", source = "roomName")
	@Mapping(target = "locationName", source = "locationName")
	BookingResponse toResponse(BookingEntity entity, String roomName, String locationName);
}
