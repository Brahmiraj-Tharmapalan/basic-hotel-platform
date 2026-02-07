"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { roomTypeSchema, RoomType } from "./schema"
import { updateRoomType } from "@/lib/api/hotels"

const formSchema = roomTypeSchema.omit({ id: true, effectivePrice: true, hotelId: true })

interface EditRoomTypeDialogProps {
    roomType: RoomType
    hotelId: number
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function EditRoomTypeDialog({ roomType, hotelId, open: controlledOpen, onOpenChange }: EditRoomTypeDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isControlled = typeof controlledOpen !== 'undefined'
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? onOpenChange! : setInternalOpen

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: roomType.name,
            description: roomType.description || "",
            basePrice: roomType.basePrice,
            capacity: roomType.capacity,
            amenities: roomType.amenities || [],
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", values.name)
            if (values.description) formData.append("description", values.description)
            formData.append("basePrice", values.basePrice.toString())
            formData.append("capacity", values.capacity.toString())

            const result = await updateRoomType(hotelId.toString(), roomType.id.toString(), null, formData)

            if (result?.message === "Room type updated successfully") {
                toast.success("Room type updated successfully!", {
                    description: `${values.name} has been updated`
                })
                setOpen(false)
            } else {
                console.error(result?.message)
                toast.error("Failed to update room type", {
                    description: result?.message || "Please try again"
                })
            }
        } catch (error) {
            console.error("Failed to update room type", error)
            toast.error("An unexpected error occurred", {
                description: "Please try again later"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Room Type</DialogTitle>
                    <DialogDescription>
                        Edit room type details. Click save when you&apos;re done.
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="basePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" disabled={isLoading} {...field} />
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
                                            <Input type="number" disabled={isLoading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" isLoading={isLoading}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
