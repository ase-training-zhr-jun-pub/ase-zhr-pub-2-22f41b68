package com.innoq.calvin.booking.location;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/locations")
public class LocationController {

	private final LocationService locationService;

	public LocationController(LocationService locationService) {
		this.locationService = locationService;
	}

	@GetMapping
	public List<LocationResponse> list() {
		return locationService.findAll();
	}

	@GetMapping("/{id}")
	public LocationResponse get(@PathVariable String id) {
		return locationService.findById(id);
	}
}
