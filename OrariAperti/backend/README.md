# OrariAperti - Room Reservation System

OrariAperti is a room reservation system built with Spring Boot and React.

## Project Structure

- `./src/main/java` - Java backend code

## Prerequisites

- Java 21
- Maven

## Development

### Backend Development

To run the backend:

1. **Copy and Modify the [application.properties](./src/main/resources/application.properties.example)**
```bash
mv ./src/main/resources/application.properties.example ./src/main/resources/application.properties
```

3. **Build the Application**
```bash
mvn spring-boot:run
```

3. **Run the Application**
```bash
java -jar target/OrariAperti-0.0.1-SNAPSHOT.jar
```

## Accessing the Application

Once running, the backend application can be accessed at:

- http://localhost:8080/

> [!NOTE]
> If you are visiting an invalid URL, the backend will redirect you to the frontend application.

## API Endpoints

Please check out the [OpenAPI documentation](./backend-openapi.yaml) for a more detailed view of the API.

## In short

The backend provides the following REST API endpoints:

- `GET /api/reservation` - Get a reservation using a private or public key
- `POST /api/reservation` - Create a new reservation
- `PUT /api/reservation/{id}` - Update an existing reservation
- `DELETE /api/reservation/{id}` - Delete a reservation
- `GET /api/room` - Get all rooms

## Features

- Create, view, update, and delete room reservations
- Private and public keys for accessing reservations
- Validation for overlapping reservations

## License

This project is licensed under the [GNU General Public License v3.0](../../LICENSE). Refer to the LICENSE file for more details.
