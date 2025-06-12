import {Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import type {Reservation} from "@/types/types";

export default function CurrentReservation({reservation}: { reservation?: Reservation }) {
    const [editData, setEditData] = useState<Reservation | undefined>(reservation);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isPrivate = !!reservation?.privateKey;

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
    }

    // Render room details
    const room = reservation.room;
    let roomDisplay = "";
    let featuresDisplay = "";
    if (room && typeof room === "object" && "roomNumber" in room) {
        roomDisplay = (room as { roomNumber?: string }).roomNumber || (room as { id?: string }).id || "";
        featuresDisplay = Array.isArray((room as { roomFeatures?: string[] }).roomFeatures)
            ? (room as { roomFeatures: string[] }).roomFeatures.join(", ")
            : "";
    } else {
        roomDisplay = String(room);
    }

    // Handlers for editing
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!editData) return;
        setEditData({ ...editData, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        if (!editData) return;
        setSaving(true);
        setError(null);
        try {
            let roomId = "";
            if (editData.room && typeof editData.room === "object" && "id" in editData.room) {
                roomId = (editData.room as { id?: string }).id || "";
            } else {
                roomId = String(editData.room);
            }
            const payload = {
                date: editData.date,
                startTime: editData.startTime,
                endTime: editData.endTime,
                room: roomId,
                description: editData.description,
                participants: editData.participants,
            };
            const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/reservation/${editData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    privateKey: editData.privateKey,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to save reservation.");
            setEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save reservation.");
        } finally {
            setSaving(false);
        }
    }

    function handleShare() {
        if (!reservation) return;
        const url = `${window.location.origin}?publicKey=${reservation.publicKey}`;
        navigator.clipboard.writeText(url);
        alert("Share link copied to clipboard!");
    }

    return (
        <Card className="h-[96%] w-full ml-8">
            <CardHeader>
                <CardTitle>Current Reservation</CardTitle>
                <CardDescription>
                    Reservation details and access keys.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <form className="space-y-3" onSubmit={e => { e.preventDefault(); if (editing) handleSave(); }}>
                    <div>
                        <Label>Date:</Label>
                        <Input name="date" value={editing && editData ? editData.date : reservation.date} onChange={handleChange} readOnly={!isPrivate || !editing} />
                    </div>
                    <div>
                        <Label>Time:</Label>
                        <div className="flex gap-2">
                            <Input name="startTime" value={editing && editData ? editData.startTime : reservation.startTime} onChange={handleChange} readOnly={!isPrivate || !editing} className="w-24" />
                            <span>-</span>
                            <Input name="endTime" value={editing && editData ? editData.endTime : reservation.endTime} onChange={handleChange} readOnly={!isPrivate || !editing} className="w-24" />
                        </div>
                    </div>
                    <div>
                        <Label>Room:</Label>
                        <Input name="room" value={roomDisplay} readOnly />
                    </div>
                    {featuresDisplay && (
                        <div>
                            <Label>Features:</Label> <div>{featuresDisplay}</div>
                        </div>
                    )}
                    <div>
                        <Label>Description:</Label>
                        <Textarea name="description" value={editing && editData ? editData.description : reservation.description} onChange={handleChange} readOnly={!isPrivate || !editing} />
                    </div>
                    <div>
                        <Label>Participants:</Label>
                        <Textarea name="participants" value={editing && editData ? editData.participants : reservation.participants} onChange={handleChange} readOnly={!isPrivate || !editing} />
                    </div>
                    <div>
                        <Label>Reservation ID:</Label> <Input value={reservation.id} readOnly />
                    </div>
                    <div>
                        <Label>Private Key:</Label> <Input value={reservation.privateKey} readOnly />
                    </div>
                    <div>
                        <Label>Public Key:</Label> <Input value={reservation.publicKey} readOnly />
                    </div>
                    {error && <div className="text-red-500 text-xs">{error}</div>}
                    <div className="flex gap-2 mt-4">
                        {isPrivate ? (
                            editing ? (
                                <>
                                    <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                                    <Button type="button" variant="secondary" onClick={() => { setEditing(false); setEditData(reservation); }}>Cancel</Button>
                                </>
                            ) : (
                                <>
                                    <Button type="button" onClick={() => { setEditing(true); setEditData(reservation); }}>Edit</Button>
                                    <Button type="button" variant="secondary" onClick={handleShare}>Share</Button>
                                </>
                            )
                        ) : (
                            <Button type="button" onClick={handleShare}>Share</Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}