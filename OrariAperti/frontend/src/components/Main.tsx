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

export default function MainUIOnly() {
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
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Field */}
                <div className="flex flex-col">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full pl-3 text-left font-normal">
                        <span>Pick a date</span>
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Room Field */}
                <div>
                  <Label>Room</Label>
                  <Select>
                    <SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="08:30">08:30</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      {/* Add more time options as needed */}
                    </SelectContent>
                  </Select>
                </div>

                {/* End Time Field */}
                <div>
                  <Label>End Time</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:30">09:30</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="10:30">10:30</SelectItem>
                      {/* Add more time options as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <Label>Description</Label>
                <Textarea
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
                <Input placeholder="John,Jane,Alex" />
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
