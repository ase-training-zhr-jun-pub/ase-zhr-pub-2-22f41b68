package com.innoq.calvin.booking.booking;

import com.innoq.calvin.booking.location.LocationRepository;
import com.innoq.calvin.booking.room.RoomRepository;
import com.innoq.calvin.booking.shared.DoubleBookingException;
import com.innoq.calvin.booking.shared.ResourceNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

	private static final String CURRENT_EMPLOYEE = "alex-berger";

	private final BookingRepository bookingRepository;
	private final RoomRepository roomRepository;
	private final LocationRepository locationRepository;
	private final BookingMapper bookingMapper;

	public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository,
			LocationRepository locationRepository, BookingMapper bookingMapper) {
		this.bookingRepository = bookingRepository;
		this.roomRepository = roomRepository;
		this.locationRepository = locationRepository;
		this.bookingMapper = bookingMapper;
	}

	public List<BookingResponse> findMyBookings() {
		return bookingRepository
				.findByEmployeeAndStatusOrderByDateAscStartTimeAsc(CURRENT_EMPLOYEE, BookingStatus.CONFIRMED).stream()
				.map(this::toResponse).toList();
	}

	public List<BookingResponse> findByRoomAndDate(String roomId, LocalDate date) {
		return bookingRepository.findByRoomIdAndDateOrderByStartTimeAsc(roomId, date).stream()
				.filter(b -> b.getStatus() == BookingStatus.CONFIRMED).map(this::toResponse).toList();
	}

	public List<BookingResponse> findByLocationAndDate(String locationId, LocalDate date) {
		return bookingRepository.findByLocationIdAndDateAndStatus(locationId, date, BookingStatus.CONFIRMED).stream()
				.map(this::toResponse).toList();
	}

	public BookingResponse findById(String id) {
		return bookingRepository.findById(id).map(this::toResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
	}

	public AvailabilityResponse checkAvailability(String roomId, LocalDate date, LocalTime startTime,
			LocalTime endTime) {
		List<BookingEntity> dayBookings = bookingRepository.findByRoomIdAndDateAndStatus(roomId, date,
				BookingStatus.CONFIRMED);
		List<BookingResponse> conflicts = dayBookings.stream()
				.filter(b -> overlaps(b.getStartTime(), b.getEndTime(), startTime, endTime)).map(this::toResponse)
				.toList();
		return new AvailabilityResponse(conflicts.isEmpty(), conflicts);
	}

	public BookingResponse create(BookingRequest request) {
		if (!request.endTime().isAfter(request.startTime())) {
			throw new IllegalArgumentException("End time must be after start time");
		}

		List<BookingEntity> dayBookings = bookingRepository.findByRoomIdAndDateAndStatus(request.roomId(),
				request.date(), BookingStatus.CONFIRMED);
		boolean hasConflict = dayBookings.stream()
				.anyMatch(b -> overlaps(b.getStartTime(), b.getEndTime(), request.startTime(), request.endTime()));
		if (hasConflict) {
			throw new DoubleBookingException("Room " + request.roomId() + " is already booked for that time window");
		}

		BookingEntity entity = new BookingEntity();
		entity.setId("b-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8));
		entity.setRoomId(request.roomId());
		entity.setLocationId(request.locationId());
		entity.setEmployee(CURRENT_EMPLOYEE);
		entity.setDate(request.date());
		entity.setStartTime(request.startTime());
		entity.setEndTime(request.endTime());
		entity.setTitle(request.title());
		entity.setNote(request.note());
		entity.setStatus(BookingStatus.CONFIRMED);

		try {
			return toResponse(bookingRepository.save(entity));
		} catch (DataIntegrityViolationException e) {
			throw new DoubleBookingException("Room was booked concurrently — please try again");
		}
	}

	public void cancel(String id) {
		BookingEntity entity = bookingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
		entity.setStatus(BookingStatus.CANCELLED);
		bookingRepository.save(entity);
	}

	private BookingResponse toResponse(BookingEntity e) {
		String roomName = roomRepository.findById(e.getRoomId()).map(r -> r.getName()).orElse(e.getRoomId());
		String locationName = locationRepository.findById(e.getLocationId()).map(l -> l.getName())
				.orElse(e.getLocationId());
		return bookingMapper.toResponse(e, roomName, locationName);
	}

	private boolean overlaps(LocalTime aStart, LocalTime aEnd, LocalTime bStart, LocalTime bEnd) {
		return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
	}
}
