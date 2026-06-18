package com.innoq.calvin.booking.equipment;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/equipment")
public class EquipmentController {

	private final EquipmentService equipmentService;

	public EquipmentController(EquipmentService equipmentService) {
		this.equipmentService = equipmentService;
	}

	@GetMapping
	public List<EquipmentResponse> list() {
		return equipmentService.findAll();
	}

	@GetMapping("/{id}")
	public EquipmentResponse get(@PathVariable String id) {
		return equipmentService.findById(id);
	}
}
