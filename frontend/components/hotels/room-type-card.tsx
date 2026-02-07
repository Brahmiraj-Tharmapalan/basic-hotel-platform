"use client"

import { RoomType } from "./schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Info } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { RoomTypeActions } from "./room-type-actions"

interface RoomTypeCardProps {
    roomType: RoomType
    hotelId: number
}

export function RoomTypeCard({ roomType, hotelId }: RoomTypeCardProps) {
    // Helper to safely convert to number with fallback
    const safeNumber = (value: unknown, fallback: number = 0): number => {
        const num = Number(value)
        return isNaN(num) ? fallback : num
    }

    const basePrice = safeNumber(roomType.basePrice, 0)
    const effectivePrice = safeNumber(roomType.effectivePrice, basePrice)
    const adjustment = effectivePrice - basePrice

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{roomType.name}</CardTitle>
                        <CardDescription>{roomType.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center text-xl font-bold">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            {roomType.effectivePrice && roomType.effectivePrice !== roomType.basePrice ? (
                                <TooltipProvider>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-muted-foreground line-through text-sm">${basePrice.toFixed(2)}</span>
                                        <span>${effectivePrice.toFixed(2)}</span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className="text-sm">
                                                    <p className="font-semibold mb-1">Price Calculation:</p>
                                                    <p>Base Price: ${basePrice.toFixed(2)}</p>
                                                    <p>Adjustment: {adjustment >= 0 ? '+' : ''}${adjustment.toFixed(2)}</p>
                                                    <p className="border-t mt-1 pt-1">Effective: ${effectivePrice.toFixed(2)}</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                            ) : (
                                <span>${basePrice.toFixed(2)}</span>
                            )}
                            <span className="text-sm font-normal text-muted-foreground ml-1">/night</span>
                        </div>
                        <RoomTypeActions roomType={roomType} hotelId={hotelId} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Up to {roomType.capacity} guests</span>
                    </div>
                    {roomType.amenities && roomType.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {roomType.amenities.map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="font-normal">
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
