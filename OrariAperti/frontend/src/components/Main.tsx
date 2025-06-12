import { useState } from "react";
import AccessKeys from "@/components/AccessKeys.tsx";
import CurrentReservation from "@/components/CurrentReservation.tsx";
import type { Reservation } from "@/types/types";

export default function MainUIOnly() {
  const [reservation, setReservation] = useState<Reservation | undefined>(undefined);

  return (
      <main className="container mx-auto px-2 sm:px-6 pt-6 h-screen min-h-screen flex flex-row items-center w-full">
          <AccessKeys onReservationLoaded={setReservation}/>
          <CurrentReservation reservation={reservation}/>
      </main>
  );
}
