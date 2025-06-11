import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import {useForm} from "react-hook-form";
import type {ReservationDTO} from "@/types/types.ts";
import axios from "axios";

export default function MainUIOnly() {
  const { register, handleSubmit, reset, watch, setValue } = useForm<ReservationDTO>();
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
      <main className="container mx-auto px-2 sm:px-6 pt-6 min-h-screen flex flex-col items-center w-full">
        <h1 className="text-3xl font-bold mb-6">Create a Reservation</h1>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>New Reservation</CardTitle>
            <CardDescription>
              Fill out the form below to create a new reservation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Field */}
                <div className="flex flex-col">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full pl-3 text-left font-normal">
                        <span>{watch("date") || "Pick a date"}</span>
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          mode="single"
                          initialFocus
                          selected={watch("date") ? new Date(watch("date")) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              setValue("date", date.toISOString().split("T")[0]); // Convert Date to YYYY-MM-DD string
                            }
                          }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Room Field */}
                <div>
                  <Label>Room</Label>
                  <Select>
                    <SelectTrigger {...register("room")}>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">Room 101</SelectItem>
                      <SelectItem value="102">Room 102</SelectItem>
                      <SelectItem value="103">Room 103</SelectItem>
                      <SelectItem value="201">Room 201</SelectItem>
                      <SelectItem value="202">Room 202</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Time Field */}
                <div>
                  <Label>Start Time</Label>
                  <Select>
                    <SelectTrigger {...register("startTime")}>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => {
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
                </div>

                {/* End Time Field */}
                <div>
                  <Label>End Time</Label>
                  <Select>
                    <SelectTrigger {...register("endTime")}>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => {
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
                </div>
              </div>

              {/* Description Field */}
              <div>
                <Label>Description</Label>
                <Textarea {...register("description")}
                    placeholder="Enter a description for your reservation"
                    className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Briefly describe the purpose of your reservation.
                </p>
              </div>

              {/* Participants Field */}
              <div>
                <Label>Participants</Label>
                <Input placeholder="John,Jane,Alex" {...register("participants")}/>
                <p className="text-sm text-muted-foreground">
                  Enter participant names separated by commas (letters only).
                </p>
              </div>

              <Button type="submit" className="w-full">
                Create Reservation
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
  );
}
