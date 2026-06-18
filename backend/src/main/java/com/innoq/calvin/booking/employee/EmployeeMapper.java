package com.innoq.calvin.booking.employee;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

	EmployeeResponse toResponse(EmployeeEntity entity);
}
