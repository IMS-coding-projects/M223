import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter, CardAction,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useState, useEffect} from "react";
import type {Reservation, Room} from "@/types/types";
import NewReservationDialog from "@/components/dialogs/NewReservationDialog";
import {toast} from "sonner";
import {CircleX, LucideEdit2, LucideLink, Save} from "lucide-react";
import {FeatureBadge} from "@/components/FeatureBadge";
import {format} from "date-fns";
import DeleteSingleReservationDialog from "@/components/dialogs/DeleteSingleReservationDialog.tsx";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

function getQueryParam(param: string) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of params.entries()) {
        if (key.toLowerCase() === param.toLowerCase()) {
            return value;
        }
    }
    return undefined;
}

export default function CurrentReservation({reservation}: { reservation?: Reservation }) {
    const [editData, setEditData] = useState<Reservation | undefined>(reservation);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState<string | null>(null);

    const privateKey = getQueryParam("privateKey");
    // @ts-expect-error: Comparing DOM element to reservation.privateKey for access control
    const isPrivate = !!reservation && document.querySelector('#privateKey').value === reservation.privateKey;

    useEffect(() => {
        setEditData(reservation);
    }, [reservation]);

    useEffect(() => {
        if (editing) {
            fetchRooms().then();
        }
    }, [editing]);

    async function fetchRooms() {
        try {
            const res = await fetch(`${API_URL}/api/room`);
            if (!res.ok) throw new Error("Failed to load rooms");
            setRooms(await res.json());
        } catch {
            toast.error("Failed to load rooms");
        }
    }

    function handleCopyLink() {
        const url = new URL(window.location.href);
        if (reservation?.publicKey) {
            url.searchParams.set("publicKey", reservation.publicKey);
            url.searchParams.delete("privateKey");
        }
        navigator.clipboard.writeText(url.toString()).then();
        toast.success("Shareable link copied!");
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!editData) return;
        setSaving(true);
        setError(null);
        try {
            const payload = {
                date: editData.date,
                startTime: editData.startTime,
                endTime: editData.endTime,
                roomId: editData.room?.id,
                description: editData.description,
                participants: editData.participants,
            };
            const res = await fetch(`${API_URL}/api/reservation/${editData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    privateKey: privateKey || "",
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Failed to update reservation");
            }
            const updated = await res.json();
            setEditing(false);
            setEditData(updated);
            toast.success("Reservation updated!");
            const url = new URL(window.location.href);
            url.searchParams.set("privateKey", updated.privateKey);
            window.history.replaceState({}, "", url.toString());
            window.location.reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err?.message || "Failed to update reservation");
            toast.error(error);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!reservation) return;
        setDeleting(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/reservation/${reservation.id}`, {
                method: "DELETE",
                headers: {
                    privateKey: privateKey || "",
                },
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Failed to delete reservation");
            }
            toast.success("Reservation deleted!");
            setEditData(undefined);
            setEditing(false);
            const url = new URL(window.location.href);
            url.searchParams.delete("privateKey");
            url.searchParams.delete("publicKey");
            window.history.replaceState({}, "", url.toString());
            window.location.reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Failed to delete reservation");
            toast.error(error);
        } finally {
            setDeleting(false);
        }
    }

    if (!reservation) {
        return (
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>No Current Reservation</CardTitle>
                    <CardDescription>
                        Please enter the provided keys on the Access Key Panel or create a new Reservation
                    </CardDescription>
                    <CardAction>
                        <NewReservationDialog/>
                    </CardAction>
                </CardHeader>
            </Card>
        );
    }

    if (editing && editData) {
        return (
            <Card className="h-full w-full">
                <form onSubmit={handleSave}>
                    <CardHeader className={"mb-4"}>
                        <CardTitle>Edit Reservation</CardTitle>
                        <CardDescription>
                            Update your reservation details below.
                        </CardDescription>
                        <CardAction>
                            <Button
                                variant="secondary"
                                onClick={() => setEditing(false)}
                                title="Cancel editing"
                            >
                                <CircleX/>Cancel Editing
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={editData.date}
                                onChange={e => setEditData({...editData, date: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label>Room</Label>
                            <select
                                className="w-full border rounded px-2 py-2"
                                value={editData.room?.id || ""}
                                onChange={e => {
                                    const room = rooms.find(r => r.id === e.target.value);
                                    setEditData({...editData, room});
                                }}
                                required
                            >
                                <option value="" disabled>Select a room</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.roomNumber}
                                    </option>
                                ))}
                            </select>
                            {editData.room?.roomFeatures && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {editData.room.roomFeatures.map(f => (
                                        <FeatureBadge key={f} feature={f}/>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label>Start Time</Label>
                                <Input
                                    type="time"
                                    value={editData.startTime}
                                    onChange={e => setEditData({...editData, startTime: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <Label>End Time</Label>
                                <Input
                                    type="time"
                                    value={editData.endTime}
                                    onChange={e => setEditData({...editData, endTime: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea
                                value={editData.description}
                                onChange={e => setEditData({...editData, description: e.target.value})}
                                maxLength={200}
                                required
                            />
                        </div>
                        <div>
                            <Label>Participants</Label>
                            <Input
                                value={editData.participants}
                                onChange={e => setEditData({...editData, participants: e.target.value})}
                                maxLength={255}
                                required
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                    </CardContent>
                    <CardFooter className="flex gap-2 mt-4">
                        <Button type="button" className={"w-1/2"} variant="secondary" onClick={() => setEditing(false)}>
                            <CircleX/>Cancel Editing
                        </Button>
                        <Button type="submit" className={"w-1/2"} disabled={saving}>
                            {saving ? "Saving..." : <><Save/>Save</>}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        );
    }

    return (
        <>
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>
                        Reservation for Room {reservation.room?.roomNumber}
                    </CardTitle>
                    <CardDescription>
                        {reservation.date && (
                            <span>
                                {format(new Date(reservation.date), "PPP")}
                                {" · "}
                                {reservation.startTime} - {reservation.endTime}
                            </span>
                        )}
                    </CardDescription>
                    <CardAction>
                        <Button
                            onClick={handleCopyLink}
                            title="Copy shareable link"
                        >
                            <LucideLink size={16}/>
                            Share
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Room {reservation.room?.roomNumber} Features</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {reservation.room?.roomFeatures?.map(f => (
                                <FeatureBadge key={f} feature={f}/>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea value={reservation.description} className={"bg-muted resize-none"} readOnly={true}/>
                    </div>
                    <div>
                        <Label>Participants</Label>
                        <Textarea value={reservation.participants} className={"bg-muted resize-none"} readOnly={true}/>
                    </div>
                    <div>
                        <div className="flex flex-col gap-1">
                            {reservation.privateKey && (
                                <>
                                    <Label htmlFor={"privatekey-input-current"} className={"cursor-pointer"}>Private Key</Label>
                                    <Input
                                        id="privatekey-input-current"
                                        type="text"
                                        value={reservation.privateKey}
                                        readOnly
                                        className="bg-muted mb-3 cursor-pointer select-all"
                                        onClick={e => {
                                            (e.target as HTMLInputElement).select();
                                            navigator.clipboard.writeText(reservation.privateKey).then();
                                            toast.success("Private key copied to clipboard!");
                                        }}/>
                                </>
                            )}
                            {reservation.publicKey && (
                                <>
                                    <Label htmlFor={"publickey-input-current"} className={"cursor-pointer"}>Public Key</Label>
                                    <Input
                                        id="publickey-input-current"
                                        type="text"
                                        value={reservation.publicKey}
                                        readOnly
                                        className="bg-muted cursor-pointer select-all"
                                        onClick={e => {
                                            (e.target as HTMLInputElement).select();
                                            navigator.clipboard.writeText(reservation.publicKey).then();
                                            toast.success("Public key copied to clipboard!");
                                        }}/>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    {isPrivate && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => setEditing(true)}
                                title="Edit reservation"
                                className={"w-1/2"}
                            >
                                <LucideEdit2 />
                                Edit
                            </Button>
                            <DeleteSingleReservationDialog deleting={deleting} onDelete={handleDelete} />
                        </>
                    )}
                </CardFooter>
            </Card>
        </>
    );
}