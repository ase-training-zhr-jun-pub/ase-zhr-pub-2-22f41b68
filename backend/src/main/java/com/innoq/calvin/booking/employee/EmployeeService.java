package com.innoq.calvin.booking.employee;

import com.innoq.calvin.booking.shared.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

	private static final String CURRENT_EMPLOYEE_ID = "alex-berger";

	private final EmployeeRepository employeeRepository;
	private final EmployeeMapper employeeMapper;

	public EmployeeService(EmployeeRepository employeeRepository, EmployeeMapper employeeMapper) {
		this.employeeRepository = employeeRepository;
		this.employeeMapper = employeeMapper;
	}

	@Transactional(readOnly = true)
	public EmployeeResponse getCurrent() {
		return employeeRepository.findById(CURRENT_EMPLOYEE_ID).map(employeeMapper::toResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Current employee not found"));
	}
}
