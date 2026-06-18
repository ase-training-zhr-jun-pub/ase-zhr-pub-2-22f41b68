package com.innoq.calvin.booking.room;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rooms")
public class RoomController {

	private final RoomService roomService;

	public RoomController(RoomService roomService) {
		this.roomService = roomService;
	}

	@GetMapping
	public List<RoomResponse> list(@RequestParam(name = "location-id", required = false) String locationId) {
		return roomService.findAll(locationId);
	}

	@GetMapping("/{id}")
	public RoomResponse get(@PathVariable String id) {
		return roomService.findById(id);
	}
}
