import { AddHotelDialog } from "@/components/hotels/add-hotel-dialog"
import { HotelClient } from "@/components/hotels/hotel-client"
import { getHotels } from "@/lib/api/hotels"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export default async function HotelsPage() {
    const hotels = await getHotels()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Hotels</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/rate-adjustment">
                        <Button variant="outline">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Rate Adjustments
                        </Button>
                    </Link>
                    <AddHotelDialog />
                </div>
            </div>
            <div className="flex h-full flex-1 flex-col space-y-8">
                <HotelClient data={hotels} />
            </div>
        </div>
    )
}
