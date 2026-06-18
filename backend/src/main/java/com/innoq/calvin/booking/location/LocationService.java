package com.innoq.calvin.booking.location;

import com.innoq.calvin.booking.room.RoomRepository;
import com.innoq.calvin.booking.shared.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocationService {

	private final LocationRepository locationRepository;
	private final RoomRepository roomRepository;
	private final LocationMapper locationMapper;

	public LocationService(LocationRepository locationRepository, RoomRepository roomRepository,
			LocationMapper locationMapper) {
		this.locationRepository = locationRepository;
		this.roomRepository = roomRepository;
		this.locationMapper = locationMapper;
	}

	@Transactional(readOnly = true)
	public List<LocationResponse> findAll() {
		return locationRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public LocationResponse findById(String id) {
		return locationRepository.findById(id).map(this::toResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Location not found: " + id));
	}

	private LocationResponse toResponse(LocationEntity e) {
		return locationMapper.toResponse(e, roomRepository.countByLocationId(e.getId()));
	}
}
