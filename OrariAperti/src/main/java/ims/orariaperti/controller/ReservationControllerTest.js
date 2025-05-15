// Base URL for the API
const BASE_URL = 'http://localhost:8080/api/reservation';

// Helper function to log results
const logResult = (action, result) => {
    console.log(`\n--- ${action} ---`);
    console.log(result);
};

// 1. Get All Reservations
const getAllReservations = async () => {
    try {
        const response = await fetch(BASE_URL, { method: 'GET' });
        const data = await response.json();
        logResult('Get All Reservations', data);
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
};

// 2. Get Reservation by ID
const getReservationById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, { method: 'GET' });
        if (!response.ok) throw new Error('Reservation not found');
        const data = await response.json();
        logResult('Get Reservation by ID', data);
    } catch (error) {
        console.error('Error fetching reservation by ID:', error);
    }
};

// 3. Create a New Reservation
const createReservation = async (reservation) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation),
        });
        if (!response.ok) throw new Error('Failed to create reservation');
        const data = await response.json();
        logResult('Create Reservation', data);
        return data; // Return created reservation for further testing
    } catch (error) {
        console.error('Error creating reservation:', error);
    }
};

// 4. Update a Reservation
const updateReservation = async (id, updatedReservation) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedReservation),
        });
        if (!response.ok) throw new Error('Failed to update reservation');
        const data = await response.json();
        logResult('Update Reservation', data);
    } catch (error) {
        console.error('Error updating reservation:', error);
    }
};

// 5. Delete a Reservation
const deleteReservation = async (id, privateKey) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(privateKey),
        });
        if (response.status === 200) {
            logResult('Delete Reservation', 'Reservation deleted successfully');
        } else {
            throw new Error('Failed to delete reservation');
        }
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
};

// 6. Test Room Availability Error
const testRoomAvailabilityError = async (overlappingReservation) => {
    console.log("THIS TEST SHOULD FAIL")
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(overlappingReservation),
        });
        if (!response.ok) throw new Error('Room is already reserved THIS IS GOOD IF IT SHOWS THIS');
        const data = await response.json();
        logResult('Test Room Availability Error', data);
    } catch (error) {
        console.error('Error testing room availability:', error);
    }
    console.log("THE REST SHOULD WORK")
};

// Main function to test all functionalities
const testReservationController = async () => {
    // Create a new reservation
    let userId = prompt("Enter a valid UserID:");
    const newReservation = {
        userId,
        date: '2023-12-01',
        startTime: '10:00:00',
        endTime: '12:00:00',
        room: Math.random(),
        description: 'Team meeting',
        participants: 'John,Doe,Jane',
    };
    const createdReservation = await createReservation(newReservation);

    // Get all reservations
    await getAllReservations();

    // Get reservation by ID
    if (createdReservation) {
        await getReservationById(createdReservation.id);
    }

    // Update the reservation
    const updatedReservation = {
        ...newReservation,
        description: 'Updated meeting description',
    };
    if (createdReservation) {
        await updateReservation(createdReservation.id, updatedReservation);
    }

    // Test room availability error
    const overlappingReservation = {
        ...newReservation,
        startTime: '11:00:00', // Overlaps with the created reservation
        endTime: '13:00:00',
    };
    await testRoomAvailabilityError(overlappingReservation);

    // Delete the reservation
    if (createdReservation) {
        await deleteReservation(createdReservation.id, createdReservation.privateKey);
    }
};

// Run the tests
await testReservationController();