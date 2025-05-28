# OrariAperti - Room Reservation System

OrariAperti is a room reservation system built with Spring Boot and React.

## Project Structure

- `src/main/java` - Java backend code
- `src/main/resources` - Backend resources
- `frontend` - React frontend code

## Prerequisites

- Java 21
- Maven
- Node.js and npm (optional, as they will be installed by Maven)

## Development

### Backend Development

To run the backend only:

```bash
mvn spring-boot:run
```

### Frontend Development

To run the frontend in development mode:

```bash
cd frontend
npm install
npm run dev
```

This will start the Vite development server with hot reloading.

## Building and Running the Application

To build the entire application (both backend and frontend):

```bash
mvn clean install
```

This will:
1. Install Node.js and npm (if not already installed)
2. Install frontend dependencies
3. Build the React frontend
4. Package everything into a Spring Boot JAR

To run the built application:

```bash
java -jar target/OrariAperti-0.0.1-SNAPSHOT.jar
```

## Accessing the Application

Once running, the application can be accessed at:

- http://localhost:8080

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/reservation` - Get a reservation using a private or public key
- `POST /api/reservation` - Create a new reservation
- `PUT /api/reservation/{id}` - Update an existing reservation
- `DELETE /api/reservation/{id}` - Delete a reservation

## Features

- Create, view, update, and delete room reservations
- Private and public keys for accessing reservations
- Validation for overlapping reservations
- Responsive UI