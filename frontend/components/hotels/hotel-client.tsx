"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Hotel } from "./schema"

interface HotelClientProps {
    data: Hotel[]
}

export function HotelClient({ data }: HotelClientProps) {
    return (
        <>
            <DataTable columns={columns} data={data} />
        </>
    )
}
