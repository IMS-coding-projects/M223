const BASE_URL = 'http://localhost:8080/api/reservation';

async function testReservationAPI() {
    try {
        console.log('Starting Reservation API Tests...');

        // Test POST: Create a new reservation
        console.log('Testing POST /api/reservation...');
        const newReservation = {
            date: '2023-12-01',
            startTime: '10:00',
            endTime: '11:00',
            room: 101,
            description: 'Test Meeting',
            participants: 'Alice,Bob'
        };
        const postResponse = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReservation)
        });
        const postData = await postResponse.json();
        console.log('POST Response:', postData);

        const createdReservation = postData.reservation;
        const privateKey = postData.privateKey;
        const publicKey = postData.publicKey;

        // Test GET: Fetch reservation by public key
        console.log('Testing GET /api/reservation with publicKey...');
        const getPublicResponse = await fetch(BASE_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', publicKey }
        });
        const getPublicData = await getPublicResponse.json();
        console.log('GET (publicKey) Response:', getPublicData);

        // Test GET: Fetch reservation by private key
        console.log('Testing GET /api/reservation with privateKey...');
        const getPrivateResponse = await fetch(BASE_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', privateKey }
        });
        const getPrivateData = await getPrivateResponse.json();
        console.log('GET (privateKey) Response:', getPrivateData);

        // Test PUT: Update the reservation
        console.log('Testing PUT /api/reservation/{id}...');
        const updatedReservation = {
            date: '2023-12-02',
            startTime: '12:00',
            endTime: '13:00',
            room: 102,
            description: 'Updated Meeting',
            participants: 'Alice,Charlie'
        };
        const putResponse = await fetch(`${BASE_URL}/${createdReservation.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', privateKey },
            body: JSON.stringify({ ...updatedReservation })
        });
        const putData = await putResponse.json();
        console.log('PUT Response:', putData);

        // Test DELETE: Delete the reservation
        console.log('Testing DELETE /api/reservation/{id}...');
        const deleteResponse = await fetch(`${BASE_URL}/${createdReservation.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', privateKey }
        });
        console.log('DELETE Response:', deleteResponse.status === 200 ? 'Deleted successfully' : 'Failed to delete');

    } catch (error) {
        console.error('Error during testing:', error);
    }
}

// Run the tests
testReservationAPI();