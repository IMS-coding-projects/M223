export interface Reservation extends ReservationDTO {
    id: string;
    publicKey: string;
    privateKey: string;
}

export interface ReservationDTO {
    date: string; // format: "YYYY-MM-DD"
    startTime: string; // format: "HH:mm"
    endTime: string; // format: "HH:mm"
    room: number;
    description: string;
    participants: string;
}