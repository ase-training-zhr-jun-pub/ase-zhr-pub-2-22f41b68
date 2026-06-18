package com.innoq.calvin.booking.room;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "rooms")
@Getter
@Setter
public class RoomEntity {

	@Id
	private String id;

	@Column(nullable = false)
	private String name;

	@Column(name = "location_id", nullable = false)
	private String locationId;

	private int capacity;

	@Column(name = "floor_info")
	private String floorInfo;

	@Column(name = "area_sqm")
	private int areaSqm;

	@Column(columnDefinition = "TEXT")
	private String description;

	private String color;

	@ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
	@CollectionTable(name = "room_equipment", joinColumns = @JoinColumn(name = "room_id"))
	@Column(name = "equipment_id")
	@OrderColumn(name = "equipment_order")
	private List<String> equipmentIds = new ArrayList<>();
}
