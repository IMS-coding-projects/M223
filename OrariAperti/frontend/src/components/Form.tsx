import { useForm } from "react-hook-form";
import type {ReservationDTO} from "@/types/types.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function ReservationForm() {
    const { register, handleSubmit, reset } = useForm<ReservationDTO>();

    const onSubmit = async (data: ReservationDTO) => {
        try {
            const response = await axios.post("http://localhost:8080/api/reservation", data);
            alert("Reservation created! Keys in response.");
            console.log(response.data);
            reset();
        } catch (error) {
            alert("Failed to create reservation");
            console.error(error);
        }
    };

    return (
        <Card className="max-w-md mx-auto mt-10 p-6">
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Date (YYYY-MM-DD)" {...register("date")} />
                    <Input placeholder="Start Time (HH:mm)" {...register("startTime")} />
                    <Input placeholder="End Time (HH:mm)" {...register("endTime")} />
                    <Input placeholder="Room Number" type="number" {...register("room")} />
                    <Input placeholder="Description" {...register("description")} />
                    <Input placeholder="Participants (comma separated)" {...register("participants")} />
                    <Button type="submit" className="w-full">Create Reservation</Button>
                </form>
            </CardContent>
        </Card>
    );
}
