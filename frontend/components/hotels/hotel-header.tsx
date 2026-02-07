"use client"

import Link from "next/link"
import { Hotel } from "./schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Pencil, ArrowLeft, TrendingUp } from "lucide-react"

interface HotelHeaderProps {
    hotel: Hotel
}

export function HotelHeader({ hotel }: HotelHeaderProps) {
    return (
        <div className="space-y-4">
            <Link href="/hotels">
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hotels
                </Button>
            </Link>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{hotel.name}</h1>
                        <Badge variant="outline" className="ml-2">
                            {hotel.rating.toFixed(1)} <Star className="ml-1 h-3 w-3 fill-primary text-primary" />
                        </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" />
                        {hotel.location}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/rate-adjustment">
                        <Button variant="outline" size="sm">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Rate Adjustments
                        </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Hotel
                    </Button>
                </div>
            </div>
        </div>
    )
}
