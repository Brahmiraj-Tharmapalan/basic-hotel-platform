"use client"

import { RoomType } from "./schema"
import { RoomTypeCard } from "./room-type-card"
import { AddRoomTypeDialog } from "./add-room-type-dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RoomTypesListProps {
    roomTypes: RoomType[]
    hotelId: number
}

export function RoomTypesList({ roomTypes, hotelId }: RoomTypesListProps) {
    return (
        <Tabs defaultValue="list" className="w-full">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
                <AddRoomTypeDialog hotelId={hotelId} />
            </div>
            <Separator className="my-4" />
            <TabsContent value="list" className="space-y-4">
                {roomTypes.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No room types added yet.
                    </div>
                ) : (
                    roomTypes.map((roomType) => (
                        <RoomTypeCard
                            key={roomType.id}
                            roomType={roomType}
                            hotelId={hotelId}
                        />
                    ))
                )}
            </TabsContent>
            <TabsContent value="grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roomTypes.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                        No room types added yet.
                    </div>
                ) : (
                    roomTypes.map((roomType) => (
                        <RoomTypeCard
                            key={roomType.id}
                            roomType={roomType}
                            hotelId={hotelId}
                        />
                    ))
                )}
            </TabsContent>
        </Tabs>
    )
}
