"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { roomTypeSchema } from "./schema"
import { createRoomType } from "@/lib/api/hotels"

// Omit ID since it's generated on the backend (or mock)
const formSchema = roomTypeSchema.omit({ id: true })

interface AddRoomTypeDialogProps {
    hotelId: number
}

export function AddRoomTypeDialog({ hotelId }: AddRoomTypeDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            capacity: 2,
            amenities: [],
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setStatusMessage(null)
        startTransition(async () => {
            const formData = new FormData()
            formData.append("name", values.name)
            if (values.description) formData.append("description", values.description)
            formData.append("price", values.price.toString())
            formData.append("capacity", values.capacity.toString())
            // Amenities logic if needed, for now just basic text or empty

            const result = await createRoomType(hotelId.toString(), null, formData)

            if (result?.message === "Room type created successfully") {
                setStatusMessage({ type: 'success', text: "Room type added successfully." })
                setTimeout(() => {
                    setOpen(false)
                    setStatusMessage(null)
                    form.reset()
                }, 1000)
            } else {
                setStatusMessage({ type: 'error', text: result?.message || "Failed to add room type." })
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Room Type
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Room Type</DialogTitle>
                    <DialogDescription>
                        Add a new room type to your hotel. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {statusMessage && (
                            <div className={`p-2 rounded text-sm ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {String(statusMessage.text)}
                            </div>
                        )}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ocean View Suite" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the room..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
