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

export default function AccessKeys() {
    return (
        <>
            <Card className={"h-[96%] w-[30%]"}>
                <CardHeader>
                    <CardTitle>Access Keys</CardTitle>
                    <CardDescription>Enter your Access Keys to view or edit your reservations.</CardDescription>
                </CardHeader>
                <form className="flex flex-col flex-1">
                    <CardContent className="flex-1">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="privateKey">Private Key</Label>
                                <Input
                                    type="text"
                                    id="privateKey"
                                    name="privateKey"
                                    placeholder="Enter your private key"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="publicKey">Public Key</Label>
                                <Input
                                    type="text"
                                    id="publicKey"
                                    name="publicKey"
                                    placeholder="Enter your public key"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className={"flex-col gap-2"}>
                        <Button type={"submit"} variant={"default"} className={"w-full"}>Load Reservations</Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
}