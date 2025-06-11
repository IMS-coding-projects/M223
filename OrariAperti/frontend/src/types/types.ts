export interface ReservationDTO {
    date: string; // format: "YYYY-MM-DD"
    startTime: string; // format: "HH:mm"
    endTime: string; // format: "HH:mm"
    room: number;
    description: string;
    participants: string; // comma-separated participant names
}

export interface Reservation extends ReservationDTO {
    id: string; // UUID
    privateKey: string; // UUID
    publicKey: string; // UUID
}