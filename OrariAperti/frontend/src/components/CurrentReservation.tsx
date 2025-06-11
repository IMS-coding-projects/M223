import {Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import type {Reservation} from "@/types/types";

export default function CurrentReservation({reservation}: { reservation?: Reservation }) {
    if (!reservation) {
        return (
            <>
                <Card className="h-[96%] w-full ml-8">
                    <CardHeader>
                        <CardTitle>No Current Reservation</CardTitle>
                        <CardDescription>
                            Please load your reservations to view the current reservation details.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </>
        );
    } else if (Object.keys(reservation).length === 0) {

        return (
            <Card className="h-[96%] w-full ml-8">
                <CardHeader>
                    <CardTitle>Current Reservation</CardTitle>
                    <CardDescription>
                        Reservation details and access keys.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <span className="font-semibold">Date:</span> {reservation.date}
                    </div>
                    <div>
                        <span className="font-semibold">Time:</span> {reservation.startTime} - {reservation.endTime}
                    </div>
                    <div>
                        <span className="font-semibold">Room:</span> {reservation.room}
                    </div>
                    <div>
                        <span className="font-semibold">Description:</span> {reservation.description}
                    </div>
                    <div>
                        <span className="font-semibold">Participants:</span> {reservation.participants}
                    </div>
                    <div>
                        <span className="font-semibold">Reservation ID:</span> {reservation.id}
                    </div>
                    <div>
                        <span className="font-semibold">Private Key:</span> {reservation.privateKey}
                    </div>
                    <div>
                        <span className="font-semibold">Public Key:</span> {reservation.publicKey}
                    </div>
                </CardContent>
            </Card>
        )
            ;
    }
}