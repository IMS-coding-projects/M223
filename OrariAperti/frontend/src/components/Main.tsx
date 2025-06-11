import AccessKeys from "@/components/AccessKeys.tsx";
import CurrentReservation from "@/components/CurrentReservation.tsx";

export default function MainUIOnly() {
  
  return (
      <main className="container mx-auto px-2 sm:px-6 pt-6 h-screen min-h-screen flex flex-row items-center w-full">
          <AccessKeys/>
          <CurrentReservation reservation={undefined}/>
      </main>
  );
}
