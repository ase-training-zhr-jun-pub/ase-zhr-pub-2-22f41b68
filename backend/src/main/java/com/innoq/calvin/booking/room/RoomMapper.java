package com.innoq.calvin.booking.room;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {

	RoomResponse toResponse(RoomEntity entity);
}
