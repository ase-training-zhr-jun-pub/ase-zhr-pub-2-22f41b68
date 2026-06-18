package com.innoq.calvin.booking.location;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LocationMapper {

	@Mapping(target = "roomCount", source = "roomCount")
	LocationResponse toResponse(LocationEntity entity, long roomCount);
}
