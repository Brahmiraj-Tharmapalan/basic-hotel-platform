"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Hotel } from "./schema"
import { HotelActions } from "./hotel-actions"
import Image from "next/image"
import Link from "next/link"

export const columns: ColumnDef<Hotel>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("imageUrl") as string
            return (
                <Link prefetch={false} href={`/hotels/${row.original.id}`}>
                    <div className="relative h-10 w-16 overflow-hidden rounded-md">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={row.getValue("name")}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </Link>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Link prefetch={false} href={`/hotels/${row.original.id}`} className="font-medium hover:underline">
                    {row.getValue("name")}
                </Link>
            )
        }
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            return (
                <Link prefetch={false} href={`/hotels/${row.original.id}`} className="hover:underline">
                    {row.getValue("location")}
                </Link>
            )
        }
    },
    {
        accessorKey: "rating",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Rating
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rating = parseFloat(row.getValue("rating"))
            return <div className="font-medium">{rating.toFixed(1)} / 5.0</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <HotelActions hotel={row.original} />,
    },
]
