package com.innoq.calvin.booking.equipment;

import com.innoq.calvin.booking.shared.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EquipmentService {

	private final EquipmentRepository equipmentRepository;
	private final EquipmentMapper equipmentMapper;

	public EquipmentService(EquipmentRepository equipmentRepository, EquipmentMapper equipmentMapper) {
		this.equipmentRepository = equipmentRepository;
		this.equipmentMapper = equipmentMapper;
	}

	public List<EquipmentResponse> findAll() {
		return equipmentRepository.findAll().stream().map(equipmentMapper::toResponse).toList();
	}

	public EquipmentResponse findById(String id) {
		return equipmentRepository.findById(id).map(equipmentMapper::toResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Equipment not found: " + id));
	}
}
