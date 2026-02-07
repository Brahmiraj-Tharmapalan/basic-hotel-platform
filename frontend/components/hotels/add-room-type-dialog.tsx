"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"

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

// Omit internal fields for the create form
const formSchema = roomTypeSchema.omit({
    id: true,
    hotelId: true,
    effectivePrice: true
})

interface AddRoomTypeDialogProps {
    hotelId: number
}

export function AddRoomTypeDialog({ hotelId }: AddRoomTypeDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            basePrice: 0,
            capacity: 2,
            amenities: [],
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const formData = new FormData()
            formData.append("name", values.name)
            if (values.description) formData.append("description", values.description)
            formData.append("basePrice", values.basePrice.toString())
            formData.append("capacity", values.capacity.toString())

            const result = await createRoomType(hotelId.toString(), null, formData)

            if (result?.message === "Room type created successfully") {
                toast.success("Room type added successfully!", {
                    description: `${values.name} has been added`
                })
                setOpen(false)
                form.reset()
            } else {
                toast.error("Failed to add room type", {
                    description: result?.message || "Please try again"
                })
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
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="basePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Base Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" disabled={isPending} {...field} />
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
                                                <Input type="number" disabled={isPending} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Base rate per night. Use Rate Adjustments for dynamic pricing.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button type="submit" isLoading={isPending}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
