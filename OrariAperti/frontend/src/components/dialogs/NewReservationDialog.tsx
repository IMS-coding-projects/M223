import {Label} from "@/components/ui/label.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon, LucideEdit} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {type FieldErrors, useForm} from "react-hook-form";
import type {ReservationDTO} from "@/types/types.ts";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
    DialogFooter, 
    DialogClose
} from "@/components/ui/dialog";
import {format} from "date-fns";
import {toast} from "sonner";

export default function NewReservationDialog() {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ReservationDTO>({
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    const onSubmit = async (data: ReservationDTO) => {
        // Validate startTime < endTime
        if (data.startTime && data.endTime) {
            const start = data.startTime;
            const end = data.endTime;
            if (start >= end) {
                toast.error("Start time must be before end time.");
                return;
            }
        }

        // Prepare payload for backend
        const payload = {
            ...data,
            room: parseInt(data.room as never, 10),
            date: data.date, // already YYYY-MM-DD
            startTime: data.startTime, // already HH:mm
            endTime: data.endTime, // already HH:mm
            description: data.description,
            participants: data.participants,
        };

        try {
            const response = await axios.post(import.meta.env.VITE_APP_BACKEND_URL+ "/api/reservation", payload);
            toast.error("Reservation created! Keys in response.");
            console.log(response.data);
            reset();
        } catch (error) {
            toast.error("Failed to create reservation");
            console.error(error);
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <LucideEdit />
                        <span className="hidden sm:inline">Create Reservation</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create a new Reservation</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to create a new reservation. Ensure all fields are filled out correctly.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <NewReservation
                            register={register}
                            watch={watch}
                            setValue={setValue}
                            errors={errors}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"secondary"}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="w-full sm:w-auto">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function NewReservation({
    register,
    watch,
    setValue,
    errors,
}: {
    register: ReturnType<typeof useForm<ReservationDTO>>["register"],
    watch: ReturnType<typeof useForm<ReservationDTO>>["watch"],
    setValue: ReturnType<typeof useForm<ReservationDTO>>["setValue"],
    errors: FieldErrors<ReservationDTO>,
}) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Field */}
                <div className="flex flex-col">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                data-empty={!watch("date")}
                                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                            >
                                <CalendarIcon />
                                {watch("date")
                                    ? format(new Date(watch("date")), "PPP")
                                    : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={watch("date") ? new Date(watch("date")) : undefined}
                                onSelect={date => {
                                    if (date) {
                                        setValue("date", formatDateString(date), { shouldValidate: true });
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.date && <span className="text-red-500 text-xs">{errors.date.message}</span>}
                </div>
                {/* Room Field */}
                <div>
                    <Label>Room</Label>
                    <Select onValueChange={val => setValue("room", parseInt(val, 10), { shouldValidate: true })}>
                        <SelectTrigger {...register("room", {
                            required: "Room is required",
                            validate: value => ["101", "102", "103", "201", "202"].includes(value.toString()) || "Invalid room"
                        })}>
                            <SelectValue placeholder="Select a room"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="101">Room 101</SelectItem>
                            <SelectItem value="102">Room 102</SelectItem>
                            <SelectItem value="103">Room 103</SelectItem>
                            <SelectItem value="201">Room 201</SelectItem>
                            <SelectItem value="202">Room 202</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.room && <span className="text-red-500 text-xs">{errors.room.message}</span>}
                </div>
                {/* Start Time Field */}
                <div>
                    <Label>Start Time</Label>
                    <Select onValueChange={val => setValue("startTime", val, { shouldValidate: true })}>
                        <SelectTrigger {...register("startTime", {
                            required: "Start time is required",
                            pattern: {
                                value: /^([01]\d|2[0-3]):[0-5]\d$/,
                                message: "Invalid time format"
                            }
                        })}>
                            <SelectValue placeholder="Select start time"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({length: 31}, (_, i) => {
                                const hour = 6 + Math.floor(i / 2);
                                const minute = i % 2 === 0 ? "00" : "30";
                                const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                return (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    {errors.startTime && <span className="text-red-500 text-xs">{errors.startTime.message}</span>}
                </div>
                {/* End Time Field */}
                <div>
                    <Label>End Time</Label>
                    <Select onValueChange={val => setValue("endTime", val, { shouldValidate: true })}>
                        <SelectTrigger {...register("endTime", {
                            required: "End time is required",
                            pattern: {
                                value: /^([01]\d|2[0-3]):[0-5]\d$/,
                                message: "Invalid time format"
                            }
                        })}>
                            <SelectValue placeholder="Select end time"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({length: 31}, (_, i) => {
                                const hour = 6 + Math.floor(i / 2);
                                const minute = i % 2 === 0 ? "00" : "30";
                                const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                return (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    {errors.endTime && <span className="text-red-500 text-xs">{errors.endTime.message}</span>}
                </div>
            </div>
            {/* Description Field */}
            <div>
                <Label>Description</Label>
                <Textarea
                    {...register("description", {
                        required: "Description is required",
                        maxLength: { value: 200, message: "Max 200 characters" }
                    })}
                    placeholder="Enter a description for your reservation"
                    className="resize-none"
                />
                {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                <p className="text-sm text-muted-foreground">
                    Briefly describe the purpose of your reservation.
                </p>
            </div>
            {/* Participants Field */}
            <div>
                <Label>Participants</Label>
                <Input
                    placeholder="John, Jane, Alex"
                    {...register("participants", {
                        required: "Participants are required",
                        maxLength: { value: 255, message: "Max 255 characters" },
                        pattern: {
                            value: /^[A-Za-zÄäÖöÜüß ,]+$/,
                            message: "Only letters, spaces, and commas allowed"
                        }
                    })}
                />
                {errors.participants && <span className="text-red-500 text-xs">{errors.participants.message}</span>}
                <p className="text-sm text-muted-foreground">
                    Enter participant names separated by commas (letters only).
                </p>
            </div>
        </>
    );
}

// fixes shadcn calendar which broke because of a different local date format then used in the calendar
function formatDateString(dateString: string | Date): string {
    const date = new Date(dateString)

    // Generate yyyy-mm-dd date string
    return date.toLocaleString('default', { year: 'numeric' }) + '-' + date.toLocaleString('default', { month: '2-digit' }) + '-' + date.toLocaleString('default', { day: '2-digit' })
}