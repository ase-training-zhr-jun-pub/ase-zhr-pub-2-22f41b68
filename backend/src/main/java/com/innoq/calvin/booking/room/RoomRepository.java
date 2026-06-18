package com.innoq.calvin.booking.room;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<RoomEntity, String> {
	List<RoomEntity> findByLocationId(String locationId);

	long countByLocationId(String locationId);
}
