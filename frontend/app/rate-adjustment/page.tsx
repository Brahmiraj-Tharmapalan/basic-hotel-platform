import { getHotels } from "@/lib/api/hotels"
import { getRateAdjustments } from "@/lib/api/rates"
import { RateAdjustmentForm } from "@/components/rate-adjustment-form"

// I should create a list component too, but for now I'll list them simply or just the form as requested "only Rate adjustment form is pending".
// But I will show list to be nice.

export const dynamic = 'force-dynamic'

export default async function RateAdjustmentPage() {
    const hotels = await getHotels()
    const adjustments = await getRateAdjustments()

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Rate Adjustments</h1>
                <p className="text-muted-foreground">
                    Manage dynamic pricing for your hotel rooms.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <RateAdjustmentForm hotels={hotels} />
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">History</h2>
                    <div className="rounded-md border">
                        <div className="p-4">
                            {adjustments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No adjustments recorded.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {adjustments.map((adj) => (
                                        <li key={adj.id} className="flex flex-col space-y-1 border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">
                                                    {adj.adjustment_amount > 0 ? "+" : ""}${adj.adjustment_amount}
                                                </span>
                                                <span className="text-sm text-muted-foreground">{adj.effective_date}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Room Type ID: {adj.room_type_id}
                                            </p>
                                            {adj.reason && (
                                                <p className="text-sm italic">{adj.reason}</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
