import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import { useState } from "react";
import type { Reservation } from "@/types/types";
import { toast } from "sonner";

export default function AccessKeys({ onReservationLoaded }: { onReservationLoaded?: (reservation: Reservation) => void }) {
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (privateKey) headers["privateKey"] = privateKey;
            else if (publicKey) headers["publicKey"] = publicKey;
            else throw new Error("Please enter a private or public key.");
            const res = await fetch(import.meta.env.VITE_APP_BACKEND_URL + "/api/reservation", { method: "GET", headers });
            if (!res.ok) throw new Error("Reservation not found or invalid key.");
            const data = await res.json();
            if (data.reservationDetails) {
                onReservationLoaded?.({ ...data.reservationDetails, privateKey: data.privateKey, publicKey: data.publicKey });
            } else {
                throw new Error("No reservation details found.");
            }
        } catch (err: unknown) {
            let message = "Failed to load reservation.";
            if (err instanceof Error) message = err.message;
            toast.error(message, {dismissible: true, duration: 4000});
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Card className={"h-[96%] w-[30%]"}>
                <CardHeader>
                    <CardTitle>Access Keys</CardTitle>
                    <CardDescription>Enter your Access Keys to view or edit your reservations.</CardDescription>
                </CardHeader>
                <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
                    <CardContent className="flex-1">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="privateKey">Private Key</Label>
                                <Input
                                    type="text"
                                    id="privateKey"
                                    name="privateKey"
                                    placeholder="Enter your private key"
                                    value={privateKey}
                                    onChange={e => setPrivateKey(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="publicKey">Public Key</Label>
                                <Input
                                    type="text"
                                    id="publicKey"
                                    name="publicKey"
                                    placeholder="Enter your public key"
                                    value={publicKey}
                                    onChange={e => setPublicKey(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className={"mt-[150%]"}>
                        <Button type={"submit"} variant={"default"} className={"w-full"} disabled={loading}>{loading ? "Loading..." : "Load Reservations"}</Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
}