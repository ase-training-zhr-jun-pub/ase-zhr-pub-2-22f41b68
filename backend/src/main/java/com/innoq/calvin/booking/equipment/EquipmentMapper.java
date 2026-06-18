package com.innoq.calvin.booking.equipment;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EquipmentMapper {

	EquipmentResponse toResponse(EquipmentEntity entity);
}
