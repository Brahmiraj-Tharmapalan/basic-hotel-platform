import { getHotels, getRoomTypes } from "@/lib/api/hotels"
import { getRateAdjustments } from "@/lib/api/rates"
import { RateAdjustmentForm } from "@/components/rate-adjustment-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function RateAdjustmentPage() {
    const hotels = await getHotels()
    const adjustments = await getRateAdjustments()

    // Sort adjustments by effective date (newest first)
    const sortedAdjustments = adjustments.sort((a, b) => {
        return new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime()
    })

    // Fetch room types for all hotels
    const hotelsWithRooms = await Promise.all(
        hotels.map(async (hotel) => {
            const roomTypes = await getRoomTypes(hotel.id.toString())
            return { ...hotel, roomTypes }
        })
    )

    // Helper function to find hotel and room type info
    const getRoomTypeInfo = (roomTypeId: number) => {
        for (const hotel of hotelsWithRooms) {
            if (hotel.roomTypes) {
                const roomType = hotel.roomTypes.find(rt => rt.id === roomTypeId)
                if (roomType) {
                    return {
                        hotelName: hotel.name,
                        roomTypeName: roomType.name,
                        basePrice: roomType.basePrice
                    }
                }
            }
        }
        return null
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <Link href="/hotels">
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Hotels
                </Button>
            </Link>

            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Rate Adjustments</h1>
                <p className="text-muted-foreground">
                    Manage dynamic pricing for your hotel rooms.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <RateAdjustmentForm hotels={hotelsWithRooms} />
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">History</h2>
                    <div className="rounded-md border">
                        <div className="p-4">
                            {sortedAdjustments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No adjustments recorded.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {sortedAdjustments.map((adj) => {
                                        const info = getRoomTypeInfo(adj.room_type_id)
                                        return (
                                            <li key={adj.id} className="flex flex-col space-y-1 border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">
                                                        {adj.adjustment_amount > 0 ? "+" : ""}${adj.adjustment_amount}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">{adj.effective_date}</span>
                                                </div>
                                                {info ? (
                                                    <div className="text-sm text-muted-foreground">
                                                        <p className="font-medium text-foreground">{info.hotelName}</p>
                                                        <p>{info.roomTypeName} (Base: ${info.basePrice})</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        Room Type ID: {adj.room_type_id}
                                                    </p>
                                                )}
                                                {adj.reason && (
                                                    <p className="text-sm italic">{adj.reason}</p>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
