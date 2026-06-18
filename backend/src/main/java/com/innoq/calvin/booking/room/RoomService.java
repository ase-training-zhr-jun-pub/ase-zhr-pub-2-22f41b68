package com.innoq.calvin.booking.room;

import com.innoq.calvin.booking.shared.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

	private final RoomRepository roomRepository;
	private final RoomMapper roomMapper;

	public RoomService(RoomRepository roomRepository, RoomMapper roomMapper) {
		this.roomRepository = roomRepository;
		this.roomMapper = roomMapper;
	}

	public List<RoomResponse> findAll(String locationId) {
		List<RoomEntity> rooms = locationId != null
				? roomRepository.findByLocationId(locationId)
				: roomRepository.findAll();
		return rooms.stream().map(roomMapper::toResponse).toList();
	}

	public RoomResponse findById(String id) {
		return roomRepository.findById(id).map(roomMapper::toResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));
	}
}
