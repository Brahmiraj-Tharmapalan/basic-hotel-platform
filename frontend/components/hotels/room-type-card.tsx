"use client"

import { RoomType } from "./schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign } from "lucide-react"

interface RoomTypeCardProps {
    roomType: RoomType
}

export function RoomTypeCard({ roomType }: RoomTypeCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{roomType.name}</CardTitle>
                        <CardDescription>{roomType.description}</CardDescription>
                    </div>
                    <div className="flex items-center text-xl font-bold">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {roomType.effectivePrice && roomType.effectivePrice !== roomType.price ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-muted-foreground line-through text-sm">${roomType.price}</span>
                                <span>{roomType.effectivePrice}</span>
                            </div>
                        ) : (
                            <span>{roomType.price}</span>
                        )}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/night</span>
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
