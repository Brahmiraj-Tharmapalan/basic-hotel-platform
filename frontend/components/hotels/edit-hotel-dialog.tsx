"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { hotelSchema, Hotel } from "./schema"

import { updateHotel } from "@/lib/api/hotels"

// Omit ID for creation/update and make it a pure form schema
const formSchema = hotelSchema.omit({ id: true })

interface EditHotelDialogProps {
    hotel: Hotel
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function EditHotelDialog({ hotel, open: controlledOpen, onOpenChange }: EditHotelDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isControlled = typeof controlledOpen !== 'undefined'
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? onOpenChange! : setInternalOpen

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: hotel.name,
            location: hotel.location,
            rating: hotel.rating,
            imageUrl: hotel.imageUrl || "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("location", values.location)
            formData.append("rating", values.rating.toString())
            if (values.imageUrl) {
                formData.append("imageUrl", values.imageUrl)
            }

            const result = await updateHotel(hotel.id.toString(), null, formData)

            if (result?.message === "Hotel updated successfully") {
                setOpen(false)
                // toast.success("Hotel updated successfully")
            } else {
                console.error(result?.message)
                alert(result?.message || "Failed to update hotel")
            }
        } catch (error) {
            console.error("Failed to update hotel", error)
            alert("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Hotel</DialogTitle>
                    <DialogDescription>
                        Edit hotel details. Click save when you&apos;re done.
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
                                        <Input placeholder="Hotel Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City, Country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
