"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Hotel, RoomType } from "@/components/hotels/schema"
import { createRateAdjustment as createRateAdjustmentAction } from "@/lib/api/rates"
import { getRoomTypes as fetchRoomTypes } from "@/lib/api/hotels"

const formSchema = z.object({
    hotel_id: z.string().min(1, "Please select a hotel"),
    room_type_id: z.string().min(1, "Please select a room type"),
    adjustment_amount: z.coerce.number().refine((val) => val !== 0, "Amount must not be zero"),
    effective_date: z.string().min(1, "Please select a date"),
    reason: z.string().optional(),
})

interface RateAdjustmentFormProps {
    hotels: Hotel[]
}

export function RateAdjustmentForm({ hotels }: RateAdjustmentFormProps) {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
    const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hotel_id: "",
            room_type_id: "",
            adjustment_amount: 0,
            effective_date: "",
            reason: "",
        },
    })

    // Watch hotel_id to fetch room types
    const selectedHotelId = form.watch("hotel_id")

    useEffect(() => {
        async function loadRoomTypes() {
            if (!selectedHotelId) {
                setRoomTypes([])
                return
            }

            setIsLoadingRoomTypes(true)
            try {
                const types = await fetchRoomTypes(selectedHotelId)
                setRoomTypes(types)
            } catch (error) {
                console.error("Failed to load room types", error)
            } finally {
                setIsLoadingRoomTypes(false)
            }
        }

        loadRoomTypes()
    }, [selectedHotelId])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsPending(true)
        const formData = new FormData()
        formData.append("room_type_id", values.room_type_id)
        formData.append("adjustment_amount", values.adjustment_amount.toString())
        formData.append("effective_date", values.effective_date)
        if (values.reason) {
            formData.append("reason", values.reason)
        }

        try {
            const result = await createRateAdjustmentAction(null, formData)
            if (result?.message && !result.errors) {
                alert(result.message)
                form.reset({
                    hotel_id: values.hotel_id, // Keep hotel selected
                    room_type_id: "",
                    adjustment_amount: 0,
                    effective_date: "",
                    reason: ""
                })
            } else {
                alert(result?.message || "Something went wrong")
            }
        } catch (error) {
            alert("Failed to submit")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Create Rate Adjustment</h3>
                <p className="text-sm text-muted-foreground">Adjust rates for specific room types on specific dates.</p>
            </div>
            <div className="p-6 pt-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="hotel_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hotel</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a hotel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {hotels.map((hotel) => (
                                                <SelectItem key={hotel.id} value={hotel.id.toString()}>
                                                    {hotel.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="room_type_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={!selectedHotelId || isLoadingRoomTypes}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoadingRoomTypes ? "Loading..." : "Select a room type"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roomTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.id!.toString()}>
                                                    {type.name} - ${type.price}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="adjustment_amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adjustment Amount ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="effective_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Effective Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Holiday season surcharge" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Adjustment
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
