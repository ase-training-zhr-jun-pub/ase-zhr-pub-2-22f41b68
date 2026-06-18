package com.innoq.calvin.booking.equipment;

import com.innoq.calvin.booking.shared.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EquipmentService {

	private final EquipmentRepository equipmentRepository;
	private final EquipmentMapper equipmentMapper;

	public EquipmentService(EquipmentRepository equipmentRepository, EquipmentMapper equipmentMapper) {
		this.equipmentRepository = equipmentRepository;
		this.equipmentMapper = equipmentMapper;
	}

	@Transactional(readOnly = true)
	public List<EquipmentResponse> findAll() {
		return equipmentRepository.findAll().stream().map(equipmentMapper::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public EquipmentResponse findById(String id) {
		return equipmentRepository.findById(id).map(equipmentMapper::toResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Equipment not found: " + id));
	}
}
