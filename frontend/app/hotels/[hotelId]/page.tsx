"use server"

import { notFound } from "next/navigation"
import Image from "next/image"

import { getHotel } from "@/lib/api/hotels"
import { HotelHeader } from "@/components/hotels/hotel-header"
import { RoomTypesList } from "@/components/hotels/room-types-list"
import { Separator } from "@/components/ui/separator"

interface HotelPageProps {
    params: {
        hotelId: string
    }
}

export default async function HotelPage({ params }: HotelPageProps) {
    const { hotelId } = await params

    const hotel = await getHotel(hotelId)

    if (!hotel) {
        notFound()
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <HotelHeader hotel={hotel} />

            <div className="relative aspect-video w-full overflow-hidden rounded-lg md:aspect-[2.4/1]">
                {hotel.imageUrl ? (
                    <Image
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        No Image Available
                    </div>
                )}
            </div>

            <Separator />

            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Room Types</h2>
                <RoomTypesList hotelId={hotel.id} roomTypes={hotel.roomTypes || []} />
            </div>
        </div>
    )
}
