import { useState } from "react";
import AccessKeys from "@/components/AccessKeys.tsx";
import CurrentReservation from "@/components/CurrentReservation.tsx";
import type { Reservation } from "@/types/types";

function getQueryParam(param: string) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of params.entries()) {
        if (key.toLowerCase() === param.toLowerCase()) {
            return value;
        }
    }
    return undefined;
}

export default function MainUIOnly() {
    const [reservation, setReservation] = useState<Reservation | undefined>(undefined);

    const publicKey = getQueryParam("publicKey");
    const privateKey = getQueryParam("privateKey");

    return (
        <main className="container mx-auto p-6 w-full">
            <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-100px)]">
                <div className="w-full md:w-1/3 flex-shrink-0 h-full md:h-auto">
                    <AccessKeys
                        onReservationLoaded={setReservation}
                        publicKey={publicKey || undefined}
                        privateKey={privateKey || undefined}
                    />
                </div>
                <div className="w-full md:w-2/3 flex-grow h-full md:h-auto">
                    <CurrentReservation reservation={reservation}/>
                </div>
            </div>
        </main>
    );
}